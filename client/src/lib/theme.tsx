import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Reading themes. Each one only changes surface/background tones — the gold
 * accent and typography stay constant so the brand reads the same everywhere.
 */
export type ThemeName = "cream" | "sand" | "navy";

export const themes: { name: ThemeName; label: string; swatch: string }[] = [
  { name: "cream", label: "Cream", swatch: "var(--cream)" },
  { name: "sand", label: "Sand", swatch: "oklch(0.92 0.032 82)" },
  { name: "navy", label: "Navy", swatch: "var(--navy)" },
];

export const themeNames = themes.map((t) => t.name);

const STORAGE_KEY = "sxg-theme";

const ThemeContext = createContext<{ theme: ThemeName; setTheme: (t: ThemeName) => void }>({
  theme: "cream",
  setTheme: () => {},
});

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.remove("dark", "theme-sand");
  if (theme === "navy") root.classList.add("dark");
  if (theme === "sand") root.classList.add("theme-sand");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("cream");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (stored && (themeNames as string[]).includes(stored)) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: ThemeName) => {
        setTheme(next);
        applyTheme(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
