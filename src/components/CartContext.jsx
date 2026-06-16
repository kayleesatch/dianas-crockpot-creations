/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from "react"

const CartContext = createContext(null)

export function useCart() {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return context;
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (error) {
                console.error("Error loading saved cart:", error)
                return [];
            }
        }

        return [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        const cartKey = `${item.id}-${item.size || "default"}-${item.modification || "none"}`;

        setCartItems(prevItems => {
            const existing = prevItems.find(i => i.cartKey === cartKey);

            if (existing) {
                return prevItems.map(i =>
                    i.cartKey === cartKey 
                        ? { ...i, quantity: i.quantity + 1 } 
                        : i
                );
            }

            return [
                ...prevItems, 
                { 
                    ...item,
                    cartKey,
                    quantity: 1,
                    price: Number(item.price) || 0
                }
            ];
        });
    };

    const removeFromCart = (cartKey) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.cartKey !== cartKey)
        );
    };

    const updateQuantity = (cartKey, quantity) => {
        const newQuantity = Number(quantity);

        if (newQuantity <= 0) {
            removeFromCart(cartKey);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartKey === cartKey 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );
    };

    const increaseQuantity = (cartKey) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartKey === cartKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
        );
    };

    const decreaseQuantity = (cartKey) => {
        setCartItems(prevItems =>
            prevItems
                .map(item =>
                    item.cartKey === cartKey
                        ? { ...item, quantity: item.quantity -1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const total = useMemo(() => {
        return cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity, 
            0
        );
    }, [cartItems]);

    return (
        <CartContext.Provider 
            value={{ 
                cartItems, 
                addToCart, 
                removeFromCart, 
                updateQuantity,
                increaseQuantity,
                decreaseQuantity, 
                clearCart, 
                total 
            }}
        >
            {children}
        </CartContext.Provider>
    );
}