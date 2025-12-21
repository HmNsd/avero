"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 bg-stone-200/80 dark:bg-gray-800/80 backdrop-blur-sm text-stone-800 dark:text-gray-200 px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-stone-300/50 dark:border-gray-700/50"
      aria-label="Toggle dark mode"
    >
      <span className="hidden xs:inline">{theme === "dark" ? "🌙 Dark" : "☀️ Light"}</span>
      <span className="xs:hidden">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}