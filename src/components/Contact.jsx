import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export default function Contact() {
    return (
        <section 
            id="contact" 
            className="relative min-h-screen flex flex-col items-center justify-center text-center z-10 bg-[url('/images/DessertsImg.jpg')] bg-fixed bg-center bg-cover px-4 py-12">
                <div className="bg-purple-400 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg max-w-2xl w-full">
            <h2 className="text-4xl text-purple-700 font-bold mb-6">Get in Touch</h2>
            <p className="text-lg text-center max-w-xl">
                Have a question about an order, want to request a dish, or just want to say hi? Reach out to Diana any time.
            </p>
                </div>

            <div className="flex space-x-6 mt-4">
                <a 
                    href="mailto:dianascrockpot@gmail.com"
                    className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition flex items-center space-x-2"    
                    >
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Email Diana</span>
                </a>

                <a 
                    href="https://www.facebook.com/profile.php?id=61566333158010"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center space-x-2"    
                    >
                    <FontAwesomeIcon icon={faFacebook} />
                    <span>Facebook</span>
                </a>
            </div>

            <div className="mt-8">
                <a
                    href="https://www.facebook.com/profile.php?id=61566333158010&sk=photos"
                    className="inline-block px-20 py-8 bg-orange-300 bg-opacity-80 text-white text-3xl font-semibold rounded-lg shadow-md hover:bg-orange-400 hover:bg-opacity-90 transition duration-300"
                >
                    View Gallery
                </a>
            </div>
        </section>
    )
}