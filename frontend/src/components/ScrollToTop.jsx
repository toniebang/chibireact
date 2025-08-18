// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Si vas a un hash (#seccion), deja que el navegador haga el scroll al anchor
    if (hash) return;

    // Scroll instantáneo (recomendado para e-commerce)
    window.scrollTo(0, 0);

    // Si prefieres animación, cambia por:
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, search, hash]);

  return null;
}
