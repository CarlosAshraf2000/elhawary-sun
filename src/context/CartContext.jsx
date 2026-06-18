import { useReducer, useEffect, useMemo } from "react";
import { CartContext } from "../hooks/useCart";
import { getEffectivePrice, isInStock, getAvailableStock } from "../data/productDefaults";

const STORAGE_KEY = "elhawary-cart";

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function cartReducer(state, action) {
    switch (action.type) {
        case "ADD": {
            const { product, quantity = 1 } = action.payload;
            if (!isInStock(product)) return state;
            const stock = getAvailableStock(product);
            const effectivePrice = getEffectivePrice(product);
            const originalPrice = Number(product.price) || 0;
            const existing = state.find((i) => i.id === product.id);
            const newQty = (existing?.quantity || 0) + quantity;
            if (stock !== Infinity && newQty > stock) return state;
            if (existing) {
                return state.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [
                ...state,
                {
                    id: product.id,
                    title: product.title,
                    price: effectivePrice,
                    originalPrice: effectivePrice < originalPrice ? originalPrice : undefined,
                    imageUrl: product.imageUrl || "",
                    category: product.category || "",
                    quantity,
                    stock: stock === Infinity ? null : stock,
                },
            ];
        }
        case "UPDATE_QTY": {
            const { id, quantity } = action.payload;
            if (quantity < 1) return state.filter((i) => i.id !== id);
            const item = state.find((i) => i.id === id);
            if (item?.stock != null && quantity > item.stock) return state;
            return state.map((i) => (i.id === id ? { ...i, quantity } : i));
        }
        case "REMOVE":
            return state.filter((i) => i.id !== action.payload.id);
        case "CLEAR":
            return [];
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [items, dispatch] = useReducer(cartReducer, [], () => loadCart());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const totalPrice = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [items]
    );

    const totalItems = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            totalPrice,
            totalItems,
            addItem: (product, quantity = 1) =>
                dispatch({ type: "ADD", payload: { product, quantity } }),
            updateQty: (id, quantity) =>
                dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
            removeItem: (id) => dispatch({ type: "REMOVE", payload: { id } }),
            clearCart: () => dispatch({ type: "CLEAR" }),
        }),
        [items, totalPrice, totalItems]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
