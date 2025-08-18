import { useCart } from "./CartContext"
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"

export default function Menu() {
    const { addToCart } = useCart()
    const [modifications, setModifications] = useState({})
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      async function fetchMenu() {
        try {
          const menuCol = collection(db, "menu")
          const menuSnapshot = await getDocs(menuCol)
          const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setMenuItems(menuList)
        } catch (error) {
          console.error("Error fetching menu:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchMenu()
    }, [])

    const handleModificationChange = (index, value) => {
    setModifications(prev => ({
      ...prev,
      [index]: value
    }))
  }

  if (loading) {
    return <p className="text-white text-center mt-10">Loading Menu...</p>
  }
  
  return (
    <section id="menu" className="py-20 px-4 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative w-90 h-36 mx-auto mb-10 bg-amber-400 text-white flex items-center justify-center clip-diamond">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-dancing font-bold text-black drop-shadow-md">
          Monthly Menu
        </h2>
        </div>
        <p className="text-3xl md:text-3xl font-bold mb-10 drop-shadow-md text-orange-500 bg-gray-900 border border-white/10 rounded-lg">         
            Check out our flavors for the month!
        </p>
        <ul className="space-y-10">
            {menuItems.map((item, index) => (
                <li
              key={item.id}
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
              <div className="text-sm md:text-base text-gray-200 mb-2">
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

