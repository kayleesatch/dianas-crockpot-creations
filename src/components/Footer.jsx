export default function Footer() {
    return (
        <footer className="relative bg-purple-700 text-white text-sm z-20">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-1">

                <h2 className="text-white text-lg font-semibold">
                    Diana's Crockpot Creations
                </h2>

                <div className="text-center text-xs text-white">
                    <p>Made with 🧡 by Kaylynn Satchell</p>
                </div>

                <a 
                    href="https://kaylynn-portfolio.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"    
                >
                    <img 
                        src="/1.png" 
                        alt="KSLogo"
                        className="h-10 w-auto hover:opacity-80 transition" 
                    />
                </a>
            </div>
        </footer>
    );
}