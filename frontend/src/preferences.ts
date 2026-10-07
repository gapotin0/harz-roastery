export type SiteLanguage = "en" | "uk";
export type SiteTheme = "dark" | "light";

const LANGUAGE_KEY = "harz-language";
const THEME_KEY = "harz-theme";

function readStored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode can block storage. The choice still applies for this visit.
  }
}

export function browserTheme(): SiteTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function readLanguage(): SiteLanguage {
  const saved = readStored(LANGUAGE_KEY);
  if (saved === "en" || saved === "uk") {
    return saved;
  }

  return "uk";
}

export function readTheme(): SiteTheme {
  const saved = readStored(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  const current = document.documentElement.getAttribute("data-theme");
  if (current === "light" || current === "dark") {
    return current;
  }

  return browserTheme();
}

export function applyLanguage(language: SiteLanguage) {
  writeStored(LANGUAGE_KEY, language);
  document.documentElement.lang = language;
}

export function applyTheme(theme: SiteTheme) {
  writeStored(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? "#f3ede6" : "#120d0b");
}
