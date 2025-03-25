
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-12 h-6 rounded-full p-1 transition-colors duration-300",
        theme === "dark" ? "bg-secondary" : "bg-secondary"
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center transition-all duration-300",
          theme === "dark" ? "justify-end" : "justify-start"
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 shadow-md",
            theme === "dark" ? "bg-primary" : "bg-primary"
          )}
        >
          {theme === "dark" ? (
            <Moon className="w-3 h-3 text-secondary" />
          ) : (
            <Sun className="w-3 h-3 text-secondary" />
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
