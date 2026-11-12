import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState
} from "react";

import Icon from "./common/Icon";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("aerobreath-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("aerobreath-theme", theme);
    } catch {
      // The theme still works without persistent storage.
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-switch"
      role="switch"
      aria-label="Dark mode"
      aria-checked={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() =>
        setTheme((current) => (current === "dark" ? "light" : "dark"))
      }
    >
      <span className="theme-track" aria-hidden="true">
        <span className="theme-thumb" />
        <Icon name="sun" size={16} />
        <Icon name="moon" size={16} />
      </span>
    </button>
  );
}

export default function ThemeToggle() {
  const context = useContext(ThemeContext);

  return context ? (
    <ThemeSwitch />
  ) : (
    <ThemeProvider>
      <ThemeSwitch />
    </ThemeProvider>
  );
}