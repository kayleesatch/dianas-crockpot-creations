import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes, faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { useCart } from "./CartContext"
import { auth, db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"

export default function Nav() {
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const fetchUserRole =async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchUserRole();
    });

    return unsubscribe;
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md px-6 py-3 flex justify-between items-center bg-black">
      
      <a 
        href="#hero" 
        onClick={closeMenu}
        className="text-2xl font-bold text-white"
      >
        Diana's Crockpot Creations
      </a>
      <div className="hidden md:flex space-x-6 font-medium text-white">
        <a href="#classics" className="hover:underline hover:scale-105 transition">Classics</a>
        <a href="#menu" className="hover:underline hover:scale-105 transition">Monthly Menu</a>
        <a href="#soup" className="hover:underline hover:scale-105 transition">Soups and Chili</a>
        <a href="#desserts" className="hover:underline hover:scale-105 transition">Desserts</a>
        <a href="#contact" className="hover:underline hover:scale-105 transition">Contact</a>
        <Link to="/instructions" className="hover:underline hover:scale-105 transition">Instructions</Link>

        {role === "manager" && (
          <Link 
            to="/menu-editor"
            className='bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition'
          >
            Edit Menu
          </Link>
        )}

        <Link to="/login" className="hover:underline hover:scale-105 transition">Login</Link>
        <Link to="/cart" className="relative text-white">
          <FontAwesomeIcon icon={faCartShopping} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full px-1.5 py-0.5">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>

      <div className="md:hidden flex items-center space-x-4">
        <Link to="/cart" className="text-white">
          <FontAwesomeIcon icon={faCartShopping} size="lg" />
          {cartItems.length > 0 && ( 
            <span className="absolute top-1 bg-white text-black text-xs rounded-full px-1">
              {cartItems.length}
            </span>
          )}
        </Link>
        <button onClick={toggleMenu} aria-label="Toggle menu">
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" className="text-white" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black text-white shadow-md md:hidden flex flex-col items-center space-y-4 py-4 font-medium">
          <a className="hover:underline hover:scale-105" href="#classics" onClick={closeMenu}>Classics</a>
          <a className="hover:underline hover:scale-105" href="#menu" onClick={closeMenu}>Monthly Menu</a>
          <a className="hover:underline hover:scale-105" href="#soup" onClick={closeMenu}>Soups and Chili</a>
          <a className="hover:underline hover:scale-105" href="#desserts" onClick={closeMenu}>Desserts</a>
          <a className="hover:underline hover:scale-105" href="#contact" onClick={closeMenu}>Contact</a>
          <Link className="hover:underline hover:scale-105" to="/instructions" onClick={closeMenu}>Instructions</Link>

          {role === "manager" && (
            <Link
              to="/menu-editor"
              className='bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition'
              onClick={closeMenu}
            >
              Edit Menu
            </Link>
          )}

          <Link className="hover:underline hover:scale-105" to="/login" onClick={closeMenu}>Login</Link>
        </div>
      )}
    </nav>
  )
}
