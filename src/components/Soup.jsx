import { useCart } from "./CartContext"
import { useState } from "react"

export default function Soup() {
  const { addToCart } = useCart()
  const [modifications, setModifications] = useState({})
    const soupItems = [
        {
            name: "CHICKEN TACO SOUP",
            description: "Full of chicken, tomatoes, peppers, cream cheese and other spices.",
            sizes: [{ label: "Quart", price: 25.00, feeds: "Feeds 3-4" }]
        },
        {
            name: "CHICKEN NOODLE SOUP",
            description: "Classic chicken noodle soup, just like mom used to make.",
            sizes: [{ label: "Quart", price: 25.00, feeds: "Feeds 3-4" }]
        },
        {
            name: "STUFFED POTATO SOUP",
            description: "Potatoes, cheese, bacon, and green onion.",
            sizes: [{ label: "Quart", price: 25.00, feeds: "Feeds 3-4" }]
        },
        {
            name: "PORK GREEN CHILI",
            description: "Our homemade pork green chili is full of pork, jalapenos, green chilis, and tomatoes.",
            sizes: [{ label: "Quart", price: 25.00, feeds: "Feeds 3-4" }]
        },

    ]

      const handleModificationChange = (index, value) => {
    setModifications(prev => ({
      ...prev,
      [index]: value
    }))
  }
  
  return (
    <section id="soup" className="py-20 px-4 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative w-90 h-36 mx-auto mb-10 bg-amber-400 text-white flex items-center justify-center clip-diamond">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-dancing font-bold text-black drop-shadow-md">
            Soup and Chili
          </h2>
        </div>
        <p className="text-3xl md:text-3xl font-semibold mb-10 drop-shadow-md text-orange-500 bg-gray-900 border border-white/10 rounded-lg">
          Looking for something on the lighter side? Check out the Soups and Green Chili.
        </p>
        <ul className="space-y-10">
            {soupItems.map((item, index) => (
                <li
              key={index}
              className="bg-black backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-yellow-600">
                {item.name}
              </h3>
              <p className="text-base text-gray-200">{item.description}</p>

              <input 
                type="text"
                placeholder="Add any modifications (optional)"
                value={modifications[index] || ""}
                onChange={(e) => handleModificationChange(index, e.target.value)}
                className="w-full mt-4 px-3 py-2 rounded border border-white/30 bg-gray-700 text-white placeholder-gray-400" 
              />
               <div className="text-sm md:text-base text-gray-200 mb-2">
                {item.sizes.map((sizeOption, sIndex) => (
                  <div key={sIndex} className="inline-block text-center mx-2">
                    <button
                      key={sIndex}
                      onClick={() =>
                        addToCart({
                          id: `soup_${index}_${sizeOption.label}`,
                          name: item.name,
                          size: sizeOption.label,
                          price: sizeOption.price,
                          modification: modifications[index] || "",
                        })
                      }
                      className="px-4 py-2 mt-4 mx-2 bg-orange-300 font-semibold hover:bg-orange-400 text-black rounded"
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