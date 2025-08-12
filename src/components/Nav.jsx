import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { HashLink } from 'react-router-hash-link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes, faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { useCart } from "./CartContext"
import { auth, db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"
import { signOut } from 'firebase/auth'

export default function Nav() {
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setRole(null);
    closeMenu()
  };

  useEffect(() => {
    const fetchUserRole =async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    fetchUserRole();
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      fetchUserRole();
    });
    
    return unsubscribe;
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md px-6 py-3 flex justify-between items-center bg-black">
      
      <HashLink 
        smooth
        to="/#hero" 
        onClick={closeMenu}
        className="text-2xl font-bold text-white"
      >
        Diana's Crockpot Creations
      </HashLink>
      <div className="hidden md:flex space-x-6 font-medium text-white">
        <HashLink smooth to="/#classics" className="hover:underline hover:scale-105 transition">Classics</HashLink>
        <HashLink smooth to="/#menu" className="hover:underline hover:scale-105 transition">Monthly Menu</HashLink>
        <HashLink smooth to="/#soup" className="hover:underline hover:scale-105 transition">Soups and Chili</HashLink>
        <HashLink smooth to="/#desserts" className="hover:underline hover:scale-105 transition">Desserts</HashLink>
        <HashLink smooth to="/#contact" className="hover:underline hover:scale-105 transition">Contact</HashLink>
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
        {currentUser && (
          <button
            onClick={handleLogout}
            className='hover:underline hover:scale-105 transition text-red-400'
          >
            Logout
          </button>
        )}
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
          <HashLink smooth className="hover:underline hover:scale-105" to="/#classics" onClick={closeMenu}>Classics</HashLink>
          <HashLink smooth className="hover:underline hover:scale-105" to="/#menu" onClick={closeMenu}>Monthly Menu</HashLink>
          <HashLink smooth className="hover:underline hover:scale-105" to="/#soup" onClick={closeMenu}>Soups and Chili</HashLink>
          <HashLink smooth className="hover:underline hover:scale-105" to="/#desserts" onClick={closeMenu}>Desserts</HashLink>
          <HashLink smooth className="hover:underline hover:scale-105" to="/#contact" onClick={closeMenu}>Contact</HashLink>
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
          {currentUser && (
            <button
              onClick={handleLogout}
              className='hover:underline hover:scale-105 transition text-red-400'
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
