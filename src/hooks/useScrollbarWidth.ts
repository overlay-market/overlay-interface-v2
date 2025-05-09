import { useEffect } from "react";

const useScrollbarWidth = () => {
  useEffect(() => {
    const setScrollbarWidth = () => {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.offsetWidth || 0;
      document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
    };
    
    setScrollbarWidth();

    window.addEventListener("resize", setScrollbarWidth);
    window.addEventListener("popstate", setScrollbarWidth);
    
    const observer = new MutationObserver(() => {
      setScrollbarWidth();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      window.removeEventListener("resize", setScrollbarWidth);
      window.removeEventListener("popstate", setScrollbarWidth);
      observer.disconnect();
    };
  }, []); 
};

export default useScrollbarWidth;