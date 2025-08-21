"use client";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button
      className="px-3 py-2 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/80"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌞 Light" : "🌚 Dark"}
    </button>
  );
}
