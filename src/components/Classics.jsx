import { useCart } from "./CartContext"
import { useState } from "react";

export default function Classics() {
  const { addToCart } = useCart()
  const [modifications, setModifications] = useState({})

  const classics = [
    {
      name: "MISSISSIPPI POT ROAST WITH VEGGIES",
      description: "Chuck roast seasoned with pepperocinis and ranch seasoning give this pot roast a unique flavor, surrounded with potatoes, carrots, celery and onions in a rich brown gravy.",
      sizes: [
        { label: "Small", price: 30.00, feeds: "Feeds 3-4" },      
        { label: "Large", price: 50.00, feeds: "Feeds 6-8" }
      ] 
    },
    {
      name: "MEATLOAF WITH VEGGIES",
      description: "Our homemade meatloaf surrounded by carrots, potatoes, onions and celery.",
      sizes: [
        { label: "Small", price: 30.00, feeds: "Feeds 3-4" }, 
        { label: "Large", price: 50.00, feeds: "Feeds 6-8" } 
      ]
    },
    {
      name: "BEEF MOCK ROULADEN",
      description: "This version of the German dish that is so delicious, it will make you feel like you're in Germany. Beef stew meat, dill pickles, onion, Swiss cheese and bacon cooked until tender and then put over egg noodles or potato dumplings with a side of pickled red cabbage.",
      sizes: [
        { label: "Small", price: 30.00, feeds: "Feeds 3-4" },
        { label: "Large", price: 50.00, feeds: "Feeds 6-8" }
      ] 
    },
  ];

  const handleModificationChange = (index, value) => {
    setModifications(prev => ({
      ...prev,
      [index]: value
    }))
  }

  return (
    <section id="classics" className="py-20 px-4 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative w-90 h-36 mx-auto mb-10 bg-amber-400 text-white flex items-center justify-center clip-diamond">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-dancing font-bold text-black drop-shadow-md">
              Classics
            </h2>
        </div>
        <p className="text-3xl md:text-3xl font-semibold mb-10 drop-shadow-md text-orange-500 bg-gray-900 border border-white/10 rounded-lg">
          Classics that give a comfortable feel, and taste just like home.
        </p>
        
        <ul className="space-y-10">
          {classics.map((item, index) => (
            <li
              key={index}
              className="bg-black backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-600">
                {item.name}
              </h3>
              <p className="text-md text-gray-200">{item.description}</p>

              <input 
                type="text"
                placeholder="Add any modifications (optional)"
                value={modifications[index] || ""}
                onChange={(e) => handleModificationChange(index, e.target.value)}
                className="w-full mt-4 px-3 py-2 rounded border border-white/30 bg-gray-700 text-white placeholder-gray-400" 
              />
              <div className="text-sm md:text-base text-gray-200">
                {item.sizes.map((sizeOption, sIndex) => (
                  <div key={sIndex} className="inline-block text-center mx-2">
                    <button
                      onClick={() =>
                        addToCart({
                          id: `classic_${index}_${sizeOption.label}`,
                          name: item.name,
                          size: sizeOption.label,
                          price: sizeOption.price,
                          modification: modifications[index] || "",
                        })
                      }
                      className="px-4 py-2 mt-4 mx-2 bg-orange-300 hover:bg-orange-400 text-black font-semibold rounded"
                      >
                    {sizeOption.label} - ${sizeOption.price.toFixed(2)}
                  </button>
                  <div className="text-base text-gray-300 mt-2">{sizeOption.feeds}</div>
                </div>
              ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
