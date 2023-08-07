import { useEffect, useState } from "react";
import Arrived from "./components/Arrived";
import AsideMenu from "./components/AsideMenu";
import Browse from "./components/Browse";
import Clients from "./components/Clients";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Offline from "./components/Offline";
import Splash from "./pages/Splash";
import Profile from "./pages/Profile";
import Details from "./pages/Details";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart";

function App({ cart }) {
  const [items, setItems] = useState([]);
  const [offlineStatus, setOfflineStatus] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  const handleOfflineStatus = () => setOfflineStatus(!navigator.onLine);

  useEffect(() => {
    (async function () {
      const response = await fetch("https://bwacharity.fly.dev/items", {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          // "x-api-key": process.env.REACT_APP_APIKEY,
        },
      });
      const { nodes } = await response.json();
      setItems(nodes);

      if (!document.querySelector('script[src="/carousel.js"]')) {
        const script = document.createElement("script");
        script.src = "/carousel.js";
        script.async = false;
        document.body.appendChild(script);
      }
    })();

    handleOfflineStatus();
    window.addEventListener("online", handleOfflineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => {
      window.removeEventListener("online", handleOfflineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, [offlineStatus]);

  return (
    <>
      {isLoading ? (
        <Splash />
      ) : (
        <>
          {offlineStatus && <Offline />}
          <Header mode="light" cart={cart} />
          <Hero />
          <Browse />
          <Arrived items={items} />
          <Clients />
          <AsideMenu />
          <Footer />
        </>
      )}
    </>
  );
}

export default function AppRoutes() {
  const cachedCart = window.localStorage.getItem("cart");
  const [cart, setCart] = useState([]);

  function handleAddToCart(item) {
    const currentIndex = cart.length;
    const newCart = [...cart, { id: currentIndex + 1, item }];
    setCart(newCart);
    window.localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function handleRemoveCartItem(event, id) {
    const revisedCart = cart.filter(function (item) {
      return item.id !== id;
    });
    setCart(revisedCart);
    window.localStorage.setItem("cart", JSON.stringify(revisedCart));
  }

  useEffect(function () {
    console.info("useEffect for localStorage");
    if (cachedCart !== null) {
      setCart(JSON.parse(cachedCart));
    }
  }, [cachedCart])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App cart={cart} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details/:id" element={<Details handleAddToCart={handleAddToCart} cart={cart} />} />
        <Route path="/cart" element={<Cart cart={cart} handleRemoveCartItem={handleRemoveCartItem} />} />
      </Routes>
    </BrowserRouter>
  );
}
