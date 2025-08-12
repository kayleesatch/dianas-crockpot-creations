import { useCart } from "./CartContext";
import { useState } from "react";

export default function Desserts() {
    const { addToCart } = useCart()
    const [modifications, setModifications] = useState({})
    const [danishFlavor, setDanishFlavor] = useState("")

    const handleModificationChange = (index, value) => {
        setModifications(prev => ({
            ...prev,
            [index]: value
        }))
    }

  const desserts = [
    {
      name: "COCONUT CREAM PIE",
      description: "Creamy coconut in a homemade pie crust.",
      sizes: [{ label: "9inch", price: 25.00 }]
    },
    {
      name: "KEY LIME PIE",
      description: "Creamy smooth key lime in a graham cracker crust.",
      sizes: [{ label: "9inch", price: 25.00 }]
    },
    {
      name: "BREAD PUDDING WITH BOURBON SAUCE",
      description: "Old fashion bread pudding with raisins and creamy bourbon sauce to go on top.",
      sizes: [{ label: "9inch", price: 25.00 }]
    },
    {
        name: "DANISH",
        description:"Your choice of fruit (Cherry, Sour Cherry, Blueberry, Lemon, Strawberry, Raspberry, Rhubarb, Apple and Mixed Berry) made with cream cheese and a flaky crust.",
        sizes: [{ label: "9 X 13", price: 25.00 }]
    },
    {
        name: "CARROT CAKE WITH CREAM CHEESE FROSTING",
        description: "Carrots, raisins and pecans make this moist cake delicious.",
        sizes: [{ label: "9 X 13", price: 40.00 }]
    },
    {
        name: "GERMAN CHOCOLATE CAKE",
        description: "Chocolate cake with mini chocolate chips make this cake super moist, then covered with my homemade coconut pecan frosting, delicious.",
        sizes: [{ label: "9 X 13", price: 45.00 }]
    },
    {
        name: "BLACK FOREST CHERRY CHOCOLATE CAKE",
        description: "Chocolate cake with mini chocolate chips, makes this cake exceptionally moist and then covered with cherries, whip cream and chocolate shavings.",
        sizes: [{ label: "9 X 13", price: 50.00 }]
    },
    {
        name: "SOUTHERN HUMMINGBIRD CAKE",
        description: "This moist cake is made with bananas, pineapple, and pecans then covered with cream cheese frosting.",
        sizes: [{ label: "9 X 13", price: 40.00 }]
    },
    {
        name: "BANANA SPLIT CAKE",
        description: "A twist on the original banana split, with graham cracker crumbs, cream cheese base with bananas, pineapples, whipping cream, maraschino cherries, pecans and chocolate drizzle.",
        sizes: [{ label: "9 X 13", price: 50.00 }]
    }
  ];

  return (
    <section 
        id="desserts" 
        className="relative z-10 bg-[url('/images/DessertsImg.jpg')] bg-fixed bg-center bg-cover">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative w-90 h-36 mx-auto mb-10 bg-gray-300 text-white flex items-center justify-center clip-diamond">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-dancing font-bold text-black drop-shadow-md">
              Desserts
            </h2>
        </div>
        <p className="text-3xl md:text-3xl font-semibold mb-10 drop-shadow-md text-blue-800 bg-purple-500 border border-white/10 rounded-lg">
            Sweet treats to satisfy your sweet tooth.
        </p>
        
        <ul className="space-y-10">
          {desserts.map((item, index) => (
            <li
              key={index}
              className="bg-purple-300 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-purple-500">
                {item.name}
              </h3>
              <p className="text-md text-black">{item.description}</p>

              {item.name === "DANISH" && (
                <div className="mt-4">
                    <label className="block text-black font-semibold mb-2">Choose a Flavor:</label>
                    <select
                        value={danishFlavor}
                        onChange={(e) => setDanishFlavor(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-white/30 bg-gray-500 text-white"
                    >
                        <option value="">Select Flavor</option>
                        <option value="Cherry">Cherry</option>
                        <option value="SourCherry">Sour Cherry</option>
                        <option value="Blueberry">Blueberry</option>
                        <option value="Lemon">Lemon</option>
                        <option value="Strawberry">Strawberry</option>
                        <option value="Raspberry">Raspberry</option>
                        <option value="Rhubarb">Rhubarb</option>
                        <option value="Apple">Apple</option>
                        <option value="Mixed Berry">Mixed Berry</option>
                    </select>
                </div>
              )}

              <input 
                type="text"
                placeholder="Add any modifications (optional)"
                value={modifications[index] || ""}
                onChange={(e) => handleModificationChange(index, e.target.value)}
                className="w-full mt-4 px-3 py-2 rounded border border-white/30 bg-gray-500 text-white placeholder-gray-400"
              />

              <div className="text-sm md:text-base text-gray-200 italic mb-2">
                {item.sizes.map((sizeOption, sIndex) => (
                  <button
                    key={sIndex}
                    onClick={() =>
                      addToCart({
                        id: `classic_${index}_${sizeOption.label}`,
                        name: item.name,
                        size: sizeOption.label,
                        price: sizeOption.price,
                        modification: modifications[index] || null,
                        flavor: item.name === "DANISH" ? danishFlavor : null,
                      })
                  }
                  className="px-4 py-2 mt-4 mx-2 bg-purple-600 hover:bg-purple-500 text-white rounded"
                >
                  {sizeOption.label} - ${sizeOption.price.toFixed(2)}
                </button>
              ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
