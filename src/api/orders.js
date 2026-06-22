import { httpsCallable } from "firebase/functions";
import {
    collection,
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    increment,
} from "firebase/firestore";
import { functions, db } from "../firebase";
import { validateCouponData, validateCouponDirect } from "./coupons";

const createOrderCallable = httpsCallable(functions, "createOrder");

function trimCustomer(customerInfo) {
    return {
        name: String(customerInfo?.name || "").trim(),
        phone: String(customerInfo?.phone || "").trim(),
        address: String(customerInfo?.address || "").trim(),
        notes: String(customerInfo?.notes || "").trim(),
    };
}

async function buildOrderItems(cartItems) {
    const productIds = cartItems.map((i) => i.id).filter(Boolean);
    const productSnaps = await Promise.all(
        productIds.map((id) => getDoc(doc(db, "products", id)))
    );
    const productMap = new Map();
    productSnaps.forEach((snap, idx) => {
        if (snap.exists()) productMap.set(productIds[idx], snap.data());
    });

    let subtotal = 0;
    const orderItems = cartItems.map((item) => {
        const product = productMap.get(item.id);
        const price = product
            ? Number(product.price) || Number(item.price) || 0
            : Number(item.price) || 0;
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

    return { orderItems, subtotal };
}

async function resolveCoupon(couponInfo, subtotal) {
    if (!couponInfo?.code) {
        return { discount: 0, couponId: null, appliedCode: null };
    }

    const result = await validateCouponDirect(couponInfo.code, subtotal);
    if (!result.valid) {
        return { discount: 0, couponId: null, appliedCode: null };
    }

    return {
        discount: result.discount,
        couponId: result.coupon.id,
        appliedCode: result.coupon.code,
    };
}

/** Spark / no Functions: save order in Firestore with server-side price lookup */
export async function createCartOrderDirect(cartItems, customerInfo, couponInfo = {}) {
    const { name, phone, address, notes } = trimCustomer(customerInfo);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return { success: false, error: new Error("empty cart") };
    }
    if (name.length < 2 || phone.length < 10 || address.length < 5) {
        return { success: false, error: new Error("invalid customer") };
    }

    try {
        const { orderItems, subtotal } = await buildOrderItems(cartItems);
        const { discount, couponId, appliedCode } = await resolveCoupon(couponInfo, subtotal);
        const total = Math.max(0, subtotal - discount);
        const itemCount = orderItems.reduce((sum, i) => sum + i.quantity, 0);

        const orderPayload = {
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
            createdAt: serverTimestamp(),
        };

        if (couponId) {
            await runTransaction(db, async (transaction) => {
                const couponRef = doc(db, "coupons", couponId);
                const couponSnap = await transaction.get(couponRef);
                if (!couponSnap.exists()) {
                    throw new Error("coupon invalid");
                }
                const revalidation = validateCouponData(
                    { id: couponSnap.id, ...couponSnap.data() },
                    subtotal
                );
                if (!revalidation.valid) {
                    throw new Error(revalidation.message);
                }
                transaction.update(couponRef, { usedCount: increment(1) });
                const orderRef = doc(collection(db, "orders"));
                transaction.set(orderRef, orderPayload);
            });
        } else {
            const orderRef = doc(collection(db, "orders"));
            await runTransaction(db, async (transaction) => {
                transaction.set(orderRef, orderPayload);
            });
        }

        return { success: true, subtotal, discount, total };
    } catch (error) {
        console.error("Direct order error:", error);
        return { success: false, error };
    }
}

export async function createCartOrder(cartItems, customerInfo, couponInfo = {}) {
    try {
        const { data } = await createOrderCallable({
            items: cartItems.map((i) => ({
                id: i.id,
                title: i.title,
                price: i.price,
                quantity: i.quantity,
                imageUrl: i.imageUrl,
            })),
            customerInfo,
            couponCode: couponInfo.code || null,
        });
        return { success: true, ...data };
    } catch (error) {
        console.warn("Cloud Function unavailable, saving order via Firestore:", error);
        return createCartOrderDirect(cartItems, customerInfo, couponInfo);
    }
}

export function buildWhatsAppMessage(cartItems, customerInfo, total, couponInfo = {}) {
    const lines = cartItems.map(
        (i) => `• ${i.title} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString("ar-EG")} ج`
    );

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = couponInfo.discount || 0;
    const discountLine = discount > 0
        ? `\nخصم${couponInfo.code ? ` (${couponInfo.code})` : ""}: -${discount.toLocaleString("ar-EG")} جنيه`
        : "";

    return encodeURIComponent(
        `طلب جديد — الهواري صن\n━━━━━━━━━━━━\n${lines.join("\n")}\n━━━━━━━━━━━━\nالمجموع: ${subtotal.toLocaleString("ar-EG")} جنيه${discountLine}\nالإجمالي: ${total.toLocaleString("ar-EG")} جنيه\n\nالاسم: ${customerInfo.name}\nالهاتف: ${customerInfo.phone}\nالعنوان: ${customerInfo.address}${customerInfo.notes ? `\nملاحظات: ${customerInfo.notes}` : ""}`
    );
}
