import { useNavigate } from "react-router-dom";

export default function Instructions() {
    const navigate = useNavigate()

    return (
        <section id="instructions" className="min-h-screen bg-gradient-to-br from-purple-200 to-yellow-100 px-6 py-20 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-xl p-8 shadow-xl max-w-2xl text-center">
                <h2 className="text-4xl font-bold text-purple-700 mb-6">Cooking Instructions</h2>

                <ol className="list-decimal list-inside text-lg text-gray-800 space-y-4 mb-6">
                    <li>Put in Crockpot and open bag.</li>
                    <li>Cook on LOW for 8 hours.</li>
                    <li>If you want to speed it up, you can cut cooking time in half by cooking on HIGH.</li>
                    <li>Enjoy!!</li>
                </ol>

                <p className="italic text-gray-600">P.S. Clean up is a breeze!</p>
            </div>
            <div className="bottom-2 left-2 absolute">
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white  px-3 py-1 rounded mb-4"
                    >
                    Back to Menu
                </button>
            </div>
        </section>
    )
}