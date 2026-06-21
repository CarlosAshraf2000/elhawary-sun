const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

initializeApp();

const db = getFirestore();

function validateCouponData(coupon, subtotal) {
    if (!coupon) {
        return { valid: false, discount: 0, message: "كود الخصم غير صالح" };
    }
    if (!coupon.active) {
        return { valid: false, discount: 0, message: "هذا الكود غير نشط" };
    }
    if (coupon.expiresAt) {
        const end = coupon.expiresAt.toDate ? coupon.expiresAt.toDate() : new Date(coupon.expiresAt);
        if (end < new Date()) {
            return { valid: false, discount: 0, message: "انتهت صلاحية هذا الكود" };
        }
    }
    if (coupon.maxUses != null && (coupon.usedCount ?? 0) >= coupon.maxUses) {
        return { valid: false, discount: 0, message: "تم استنفاد هذا الكود" };
    }
    const minOrder = Number(coupon.minOrder) || 0;
    if (subtotal < minOrder) {
        return {
            valid: false,
            discount: 0,
            message: `الحد الأدنى للطلب ${minOrder.toLocaleString("ar-EG")} جنيه`,
        };
    }

    let discount = 0;
    if (coupon.type === "percent") {
        discount = Math.round((subtotal * Number(coupon.value)) / 100);
    } else {
        discount = Number(coupon.value) || 0;
    }
    discount = Math.min(discount, subtotal);

    if (discount <= 0) {
        return { valid: false, discount: 0, message: "لا يمكن تطبيق هذا الكود" };
    }

    return {
        valid: true,
        discount,
        message: "تم تطبيق الكود بنجاح",
        coupon: { id: coupon.id, code: coupon.code },
    };
}

exports.setAdminClaim = onCall(async (request) => {
    const callerUid = request.auth?.uid;
    if (!callerUid) {
        throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const callerClaims = (await getAuth().getUser(callerUid)).customClaims || {};
    const setupSecret = process.env.ADMIN_SETUP_SECRET;

    const { email, makeAdmin = true, secret } = request.data || {};
    if (!email || typeof email !== "string") {
        throw new HttpsError("invalid-argument", "Valid email is required.");
    }

    const isExistingAdmin = callerClaims.admin === true;
    const hasSetupSecret = setupSecret && secret === setupSecret;

    if (!isExistingAdmin && !hasSetupSecret) {
        throw new HttpsError("permission-denied", "Not authorized to set admin claims.");
    }

    const userRecord = await getAuth().getUserByEmail(email.trim().toLowerCase());
    await getAuth().setCustomUserClaims(userRecord.uid, { admin: makeAdmin !== false });
    return { success: true, uid: userRecord.uid, admin: makeAdmin !== false };
});

exports.validateCoupon = onCall(async (request) => {
    const { code, subtotal } = request.data || {};
    const normalized = String(code || "").trim().toUpperCase();
    const orderSubtotal = Number(subtotal) || 0;

    if (!normalized) {
        return { valid: false, discount: 0, message: "كود الخصم غير صالح" };
    }

    const snap = await db.collection("coupons").where("code", "==", normalized).limit(1).get();
    if (snap.empty) {
        return { valid: false, discount: 0, message: "كود الخصم غير صالح" };
    }

    const doc = snap.docs[0];
    const coupon = { id: doc.id, ...doc.data() };
    return validateCouponData(coupon, orderSubtotal);
});

exports.createOrder = onCall(async (request) => {
    const { items, customerInfo, couponCode } = request.data || {};

    if (!Array.isArray(items) || items.length === 0) {
        throw new HttpsError("invalid-argument", "Cart items are required.");
    }
    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
        throw new HttpsError("invalid-argument", "Customer info is incomplete.");
    }

    const name = String(customerInfo.name).trim();
    const phone = String(customerInfo.phone).trim();
    const address = String(customerInfo.address).trim();
    const notes = String(customerInfo.notes || "").trim();

    if (name.length < 2 || name.length > 100) {
        throw new HttpsError("invalid-argument", "Invalid name.");
    }
    if (phone.length < 10 || phone.length > 20) {
        throw new HttpsError("invalid-argument", "Invalid phone.");
    }
    if (address.length < 5 || address.length > 300) {
        throw new HttpsError("invalid-argument", "Invalid address.");
    }

    const productIds = items.map((i) => i.id).filter(Boolean);
    const productSnaps = await Promise.all(
        productIds.map((id) => db.collection("products").doc(id).get())
    );
    const productMap = new Map();
    productSnaps.forEach((snap, idx) => {
        if (snap.exists) productMap.set(productIds[idx], snap.data());
    });

    let subtotal = 0;
    const orderItems = items.map((item) => {
        const product = productMap.get(item.id);
        const price = product ? Number(product.price) || Number(item.price) || 0 : Number(item.price) || 0;
        const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1));
        subtotal += price * quantity;
        return {
            productId: item.id,
            title: String(item.title || product?.title || ""),
            price,
            quantity,
            imageUrl: item.imageUrl || product?.imageUrl || "",
        };
    });

    let discount = 0;
    let couponId = null;
    let appliedCode = null;

    if (couponCode) {
        const normalized = String(couponCode).trim().toUpperCase();
        const couponSnap = await db.collection("coupons").where("code", "==", normalized).limit(1).get();
        if (!couponSnap.empty) {
            const couponDoc = couponSnap.docs[0];
            const validation = validateCouponData({ id: couponDoc.id, ...couponDoc.data() }, subtotal);
            if (validation.valid) {
                discount = validation.discount;
                couponId = couponDoc.id;
                appliedCode = normalized;
            }
        }
    }

    const total = Math.max(0, subtotal - discount);
    const itemCount = orderItems.reduce((sum, i) => sum + i.quantity, 0);

    await db.runTransaction(async (transaction) => {
        if (couponId) {
            const couponRef = db.collection("coupons").doc(couponId);
            const couponDoc = await transaction.get(couponRef);
            if (!couponDoc.exists) {
                throw new HttpsError("failed-precondition", "Coupon no longer valid.");
            }
            const revalidation = validateCouponData({ id: couponDoc.id, ...couponDoc.data() }, subtotal);
            if (!revalidation.valid) {
                throw new HttpsError("failed-precondition", revalidation.message);
            }
            transaction.update(couponRef, { usedCount: FieldValue.increment(1) });
        }

        const orderRef = db.collection("orders").doc();
        transaction.set(orderRef, {
            name,
            phone,
            address,
            notes,
            items: orderItems,
            subtotal,
            discount,
            couponCode: appliedCode,
            couponId,
            total,
            itemCount,
            productCount: orderItems.length,
            source: "cart",
            done: false,
            status: "new",
            createdAt: FieldValue.serverTimestamp(),
        });
    });

    return { success: true, subtotal, discount, total };
});
