import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { applyCouponToOrder } from "./coupons";

export async function createOrder(orderData) {
    try {
        await addDoc(collection(db, "orders"), {
            ...orderData,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating order: ", error);
        return { success: false, error };
    }
}

export async function createCartOrder(cartItems, customerInfo, couponInfo = {}) {
    const items = cartItems.map((i) => ({
        productId: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
    }));

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = couponInfo.discount || 0;
    const total = Math.max(0, subtotal - discount);
    const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const result = await createOrder({
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        notes: customerInfo.notes || "",
        items,
        subtotal,
        discount,
        couponCode: couponInfo.code || null,
        couponId: couponInfo.couponId || null,
        total,
        itemCount,
        productCount: cartItems.length,
        source: "cart",
        done: false,
        status: "new",
    });

    if (result.success && couponInfo.couponId) {
        await applyCouponToOrder(couponInfo.couponId);
    }

    return result;
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
