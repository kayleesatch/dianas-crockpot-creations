import { useEffect } from "react";

export default function VenmoQR({ isOpen, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
            <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-sm w-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Scan to Pay with Venmo<br />Or tap to go to Diana on Venmo</h2>

                <a 
                    href="https://venmo.com/u/Diana-Brueckner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <img 
                        src="/images/DianaVenmoQR.jpg" 
                        alt="Venmo QR Code"
                        className="w-full h-auto" 
                    />
                </a>

                <p className="text-center text-sm mt-4">
                    Open your Venmo app and scan this code to send your payment.
                </p>
            </div>
        </div>
    )
}