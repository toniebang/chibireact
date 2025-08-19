import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Si la navegación es a un ancla (#section), deja que el navegador lo maneje
    if (hash) return;

    // Scroll suave al tope
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname, search, hash]);

  return null;
}
