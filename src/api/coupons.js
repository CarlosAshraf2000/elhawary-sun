import { httpsCallable } from "firebase/functions";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { functions, db } from "../firebase";

const validateCouponCallable = httpsCallable(functions, "validateCoupon");

export function validateCouponData(coupon, subtotal) {
    if (!coupon) {
        return { valid: false, discount: 0, message: "كود الخصم غير صالح" };
    }
    if (!coupon.active) {
        return { valid: false, discount: 0, message: "هذا الكود غير نشط" };
    }
    if (coupon.expiresAt) {
        const end = coupon.expiresAt?.toDate?.() ?? new Date(coupon.expiresAt);
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
        coupon,
    };
}

export async function validateCouponDirect(code, subtotal) {
    const normalized = String(code || "").trim().toUpperCase();
    if (!normalized) {
        return { valid: false, discount: 0, message: "كود الخصم غير صالح" };
    }

    try {
        const q = query(
            collection(db, "coupons"),
            where("code", "==", normalized),
            limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
            return { valid: false, discount: 0, message: "كود الخصم غير صالح" };
        }

        const docSnap = snap.docs[0];
        const coupon = { id: docSnap.id, ...docSnap.data() };
        return validateCouponData(coupon, subtotal);
    } catch (err) {
        console.error(err);
        return { valid: false, discount: 0, message: "تعذر التحقق من الكود" };
    }
}

export async function validateCoupon(code, subtotal) {
    try {
        const { data } = await validateCouponCallable({ code, subtotal });
        return data;
    } catch (err) {
        console.warn("Coupon function unavailable, validating via Firestore:", err);
        return validateCouponDirect(code, subtotal);
    }
}
