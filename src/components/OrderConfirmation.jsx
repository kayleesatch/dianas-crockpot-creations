import { useLocation, Link } from "react-router-dom";

export function OrderConfirmation() {
    const location = useLocation()
    const paymentMethod = location.state?.paymentMethod
    const cartItems = location.state?.cartItems || []

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Thank you for your order!</h2>

            <div className="mb-6 text-left">
                <h3 className="text-2xl mb-2">Order Summary:</h3>
                <ul className="space-y-2">
                    {cartItems.map((item) => (
                        <li key={item.id} className="bg-gray-800 p-4 rounded-md">
                            <p>{item.name} ({item.size}) * {item.quantity}</p>
                            {item.flavor && <p className="text-sm text-gray-300">Flavor: {item.flavor}</p>}
                            {item.modification && <p className="italic text-sm text-yellow-300">Modification: {item.modification}</p>}
                        </li>
                    ))}
                </ul>
            </div>

            {paymentMethod === "Venmo" ? (
                <div className="bg-white text-black p-6 rounded-lg shadow-md">
                    <p className="mb-4">Please send your payment via Venmo:</p>
                    <p className="font-bold text-lg">@Diana-Brueckner</p>
                    <img src="/venmo-qr.png" alt="Venmo QR Code" className="mt-4 w-40 h-40 mx-auto" />
                </div>
            ) : (
                <p className="text-lg">You selected to pay with {paymentMethod}. Please have payment at pickup.</p>
            )}

            <Link to="/" className="mt-8 text-orange-400 underline">
                Back to Home
            </Link>
        </section>
    )
}