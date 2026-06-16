import { useCart } from "./CartContext";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import emailjs from '@emailjs/browser'
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import VenmoQR from "./VenmoQR";

export default function Cart() {
    const [user] = useAuthState(auth)
    const navigate = useNavigate();
    const { 
        cartItems, 
        updateQuantity, 
        removeFromCart, 
        total, 
        clearCart 
    } = useCart();

    const [customerName, setCustomerName] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [address, setAddress] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVenmoQR, setShowVenmoQR] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setCustomerEmail(user.email);
        }
    }, [user]);

    const handleOrderSubmit = async () => {
        if (!user) {
            alert("Please log in to submit your order.");
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) return;

        if (!customerEmail.trim() || !address.trim() || !deliveryTime.trim() || !orderDate.trim()) {
            alert("Please fill out all delivery details before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    orders: cartItems
                        .map(item => (
                            `${item.name}
    Size: ${item.size || "N/A"}
    Flavor: ${item.flavor || "NONE"}
    Modifications: ${item.modification || "NONE"}
    Quantity: ${item.quantity}
    Item Total: $${(item.price * item.quantity).toFixed(2)}`
                    ))
                    .join("\n\n"),

                userName: customerName || user?.displayName || "Customer",
                userEmail: customerEmail,
                paymentMethod,
                deliveryTime,
                orderDate,
                address,
                total: total.toFixed(2),
            },
            import.meta.env.VITE_EMAILJS_USER_ID
        );

            clearCart();
            navigate("/order-confirmation", { state: { paymentMethod } });
        
        } catch (error) {
            alert("Sorry, there was a problem submitting your order. Please try again.");
            console.error("Failed to send order email:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-purple-200 to-yellow-100 flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-3xl font-bold text-purple-800 mb-4">
                    Your cart is empty.
                </h2>
                <p className="text-gray-700 mb-6">
                    Add something delicious from the menu to get started.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                    Back to Menu
                </button>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-purple-200 to-yellow-100 px-4 py-10">
            <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
                    Your Order
                </h2>
                <div className="space-y-4 mb-8">
                    {cartItems.map((item) => (
                        <div 
                            key={item.cartKey} 
                            className="bg-gray-100 p-4 rounded-xl shadow-sm"
                        >                                    
                            <div className="flex justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {item.name}
                                    </h3>

                                    {item.size && (
                                        <p className="text-sm text-gray-700">
                                            Size: {item.size}
                                        </p>
                                    )}
                                    
                                    {item.flavor && (
                                        <p className="text-sm text-blue-700 font-semibold">
                                            Flavor: {item.flavor}
                                        </p>
                                    )}

                                    {item.modification && ( 
                                        <p className="text-sm text-blue-700 font-semibold">
                                            Modification: {item.modification}
                                        </p>
                                    )}
                                    
                                    <p className="mt-2 text-gray-700">
                                        ${Number(item.price).toFixed(2)} each
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.cartKey)}
                                    className="text-red-600 font-bold hover:underline self-start"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                        className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600"
                                    >
                                        -
                                    </button>

                                    <span className="font-bold text-lg">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                        className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="font-bold text-lg">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-6 space-y-4">
                    <h3 className="text-2xl font-bold text-purple-700">
                        Delivery Details
                    </h3>

                    <input 
                        type="text"
                        placeholder="Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="border rounded-lg p-3 w-full"
                    />

                    <input 
                        type="email"
                        placeholder="Email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="border rounded-lg p-3 w-full" 
                    />

                    <input 
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="border rounded-lg p-3 w-full" 
                    />

                    <input 
                        type="text"
                        placeholder="Delivery Time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="border rounded=lg p-3 w-full" 
                    />

                    <input 
                        type="text"
                        placeholder="Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border rounded-lg p-2 w-full" 
                    />
                </div>

                <div className="border-t mt-6 pt-6">
                    <h3 className="text-lg mb-3 font-bold">Payment Method</h3>
                

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Cash', 'Check', 'Venmo'].map((method) => (
                            <label 
                                key={method} 
                                className={`border rounded-lg p-3 cursor-pointer text-center font-bold ${
                                    paymentMethod === method
                                        ? "bg-purple-600 text-white"
                                        : "bg-white text-gray-800"
                                }`}
                            >
                                <input 
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={(e) => {
                                        const selectedMethod = e.target.value;
                                        setPaymentMethod(selectedMethod);
                                        setShowVenmoQR(selectedMethod === "Venmo");
                                    }}
                                    className="hidden" 
                                />
                                {method}
                            </label>
                        ))}
                    </div>
                </div>

                <VenmoQR 
                    isOpen={showVenmoQR} 
                    onClose={() => setShowVenmoQR(false)} 
                />

                <div className="border-t mt-6 pt-6 flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-purple-700">
                        ${total.toFixed(2)}
                    </span>
                </div>


                {!user && (
                    <div className="mb-4 text-red-600 font-bold text-center">
                        Please{" "} 
                        <Link to="/login" className="underline text-blue-700">
                            log in
                        </Link>{" "} 
                        to submit your order.
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition"
                    >
                        Back to Menu
                    </button>

                    <button
                        onClick={handleOrderSubmit}
                        disabled={!user || isSubmitting || cartItems.length === 0}
                        className={`w-full px-6 py-3 rounded-lg font-bold transition ${
                            !user || isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Order"}
                    </button>
                </div>
            </div>
        </section>
    )
}

