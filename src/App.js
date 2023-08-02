import { useEffect, useState } from "react";
import Arrived from "./components/Arrived";
import AsideMenu from "./components/AsideMenu";
import Browse from "./components/Browse";
import Clients from "./components/Clients";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Offline from "./components/Offline";

function App() {
  const [items, setItems] = useState([]);
  const [offlineStatus, setOfflineStatus] = useState(!navigator.onLine);

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
    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    }
  }, [offlineStatus]);

  return (
    <>
    {offlineStatus && <Offline />}
      <Header />
      <Hero />
      <Browse />
      <Arrived items={items} />
      <Clients />
      <AsideMenu />
      <Footer />
    </>
  );
}

export default App;
