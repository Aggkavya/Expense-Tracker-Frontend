import { createContext, useContext, useEffect, useState } from "react";

const THEME_KEY = "finance-tracker-theme";
const ThemeContext = createContext(null);

function resolveInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(resolveInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}
