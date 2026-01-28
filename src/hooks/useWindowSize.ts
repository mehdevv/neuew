"use client";
import { useState, useEffect } from "react";

function useWindowSize() {
  const [isDesktop, setDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return { isDesktop };
}
export default useWindowSize;
