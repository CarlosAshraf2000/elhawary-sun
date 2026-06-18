import { db } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    increment,
} from "firebase/firestore";

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

export async function fetchCouponByCode(code) {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return null;

    const q = query(collection(db, "coupons"), where("code", "==", normalized));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
}

export async function validateCoupon(code, subtotal) {
    try {
        const coupon = await fetchCouponByCode(code);
        return validateCouponData(coupon, subtotal);
    } catch (err) {
        console.error(err);
        return { valid: false, discount: 0, message: "تعذر التحقق من الكود" };
    }
}

export async function applyCouponToOrder(couponId) {
    if (!couponId) return;
    await updateDoc(doc(db, "coupons", couponId), {
        usedCount: increment(1),
    });
}
