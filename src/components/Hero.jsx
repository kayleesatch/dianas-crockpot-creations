export default function Hero() {
    return (
        <section id="hero" className="h-screen flex flex-col items-center justify-center px-4">
            <div className="z-10 w-full max-w-6xl mx-auto flex items-center justify-center border-[6px] border-white shadow-[0_0_25px_rgba(255,255,255,0.5)] backdrop-blur-sm bg-transparent rounded-xl p-8 md:p-10 lg:p-18">
                <h1 className="font-dancing text-6xl md:text-7xl lg:text-9xl font-bold text-white drop-shadow-sm text-center leading-tight text-balance">
                    Diana's<br />Crockpot<br />Creations
                </h1>
            </div>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    "❖ Local Delivery",
                    "❖ Accepts Venmo",
                    "❖ Cash or check",
                    "❖ Pay upon delivery",
                ].map((text, index) => (
                    <li
                        key={index}
                        className="clip-diamond w-64 max-w-xs h-20 bg-amber-500 text-white font-semibold flex items-center justify-center mx-auto shadow-lg"
                    >
                        {text}
                    </li>
                ))}
            </ul>
        </section>
    )
}