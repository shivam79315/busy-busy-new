import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const getSystemTheme = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("store-theme") || getSystemTheme();
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("store-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previousTheme) => (previousTheme === "dark" ? "light" : "dark"));
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="relative h-10 w-10 rounded-full border border-border/70 bg-card/60 backdrop-blur-md hover:bg-accent/80"
      onClick={toggleTheme}
      data-testid="theme-toggle-button"
      aria-label="Toggle light and dark theme"
    >
      <Sun className={`h-4 w-4 transition-transform transition-opacity duration-300 ${theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`} />
      <Moon className={`absolute h-4 w-4 transition-transform transition-opacity duration-300 ${theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
    </Button>
  );
};
