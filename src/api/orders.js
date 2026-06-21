import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const createOrderCallable = httpsCallable(functions, "createOrder");

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
        console.error("Error creating order: ", error);
        return { success: false, error };
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
