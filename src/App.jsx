import { Routes, Route, useLocation } from "react-router-dom"
import Nav from "./components/Nav"
import Instructions from "./components/Instructions"
import Login from "./components/Login"
import Home from "./components/Home"
import { CartProvider } from "./components/CartContext"
import Cart from "./components/Cart"
import { OrderConfirmation } from "./components/OrderConfirmation"
import MenuEditor from "./components/MenuEditor"

function Background() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  

  return isHome ? (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/CrockpotCoverImg.jpg')" }}
      ></div>
    </>
  ) : null;
}

export default function App() {
  return (
    <CartProvider>
      <div className="relative">
        <Background />
        <Nav />
        <div className="pt-18">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu-editor" element={<MenuEditor />} />
          </Routes>
        </div>
      </div>
    </CartProvider>
  )
}