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
    const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useCart()
    const [customerName, setCustomerName] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [address, setAddress] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVenmoQR, setShowVenmoQR] = useState(false);

    const handleOrderSubmit = async () => {
        if (!user) {
            alert("Please log in to submit your order.");
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) return;

        if (!customerEmail.trim() || !address.trim() || !deliveryTime.trim()) {
            alert("Please fill out all delivery details before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    orders: cartItems.map(item =>
                    `${item.name}
                    Modifications: ${item.modification || "NONE"}
                    Flavor: ${item.flavor || "NONE"}
                    Size: ${item.size}
                    Quantity: ${item.quantity}
                    $${(item.price * item.quantity).toFixed(2)}`
                    ).join("\n\n"),
                    userName: customerName || user?.displayName || "Customer",
                        paymentMethod,
                        deliveryTime,
                        orderDate,
                        address,
                        userEmail: customerEmail,
                        total: total.toFixed(2),
                },
                import.meta.env.VITE_EMAILJS_USER_ID
            );
            clearCart()
            console.log("Order Submitted", { cartItems, paymentMethod })
            navigate("/order-confirmation", { state: { paymentMethod } })
        } catch (error) {
            alert("Sorry, there was a problem submitting your order. Please try again.");
            console.error("Failed to send order email:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (user && user.email) setCustomerEmail(user.email);
    }, [user]);

    console.log("Cart items:", cartItems);

    if (cartItems.length === 0) {
        console.log("Cart is empty, showing empty message");
        return (
            <section className="min-h-screen flex flex-col items-center justify-center font-bold text-3xl text-black">
                <h2>Your cart is empty.</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-500 px-6 py-3 mt-5 rounded-lg font-bold hover:bg-blue-600 transition mb-4"
                >
                    Back to Menu
                </button>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-purple-200 to-yellow-100 px-6 py-12">
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">Your Order</h2>
                <ul className="space-y-6 mb-8">
                    {cartItems.map((item) => (
                        <li key={item.id} className=" bg-gray-400 p-4 rounded-lg shadow-md flex justify-between items-center">                                    
                            <div>
                                <h3 className="text-xl font-semibold">{item.name} ({item.size})</h3>
                                {item.flavor && <p className="italic text-lg font-bold text-blue-600">Flavor: {item.flavor}</p>}
                                {item.modification && <p className="italic text-lg font-bold text-blue-600">Modification: {item.modification}</p>}
                                <p>${(item.price * item.quantity).toFixed(2)} each</p>
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                                    >-</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
                                    >+</button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-4 text-red-300 underline hover:text-red-500"
                                    >Remove</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">Name:</label>
                    <input 
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">Delivery Time:</label>
                    <input 
                        type="text"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="border rounded p-2 w-full" 
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">Delivery Date:</label>
                    <input 
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="border rounded p-2 w-full" 
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">Delivery Address:</label>
                    <input 
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl">Total: ${total.toFixed(2)}</h3>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg mb-2 font-bold">Choose Payment Method:</h3>
                    <div className="space-y-2">
                        {['Cash', 'Check', 'Venmo'].map((method) => (
                            <label key={method} className="flex items-center space-x-2">
                                <input 
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={(e) => {
                                        const method = e.target.value;
                                        setPaymentMethod(method);
                                        setShowVenmoQR(method === "Venmo");
                                    }} 
                                />
                                <span>{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <VenmoQR isOpen={showVenmoQR} onClose={() => setShowVenmoQR(false)} />

                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-500 px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition mb-4"
                >
                    Back to Menu
                </button>

                {!user && (
                    <div className="mb-4 text-red-600 font-bold">
                        Please <Link to="/login" className="underline text-blue-700">log in</Link> to submit your order.
                    </div>
                )}

                <button
                    onClick={handleOrderSubmit}
                    disabled={!user || isSubmitting || cartItems.length === 0}
                    className={`px-6 py-3 rounded-lg font-bold transition ${
                        !user || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600"
                    }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit Order"}
                </button>
        </section>
    )
}

