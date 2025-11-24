// src/themes.js

const THEMES = {
  flat: {
    background: "#ffffff",
    cardBg: "#f3f4f6",
    text: "#111827",
    accent: "#2563eb",
    border: "#e5e7eb"
  },
  onedark: {
    background: "#282c34",
    cardBg: "#3e4451",
    text: "#abb2bf",
    accent: "#e06c75",
    border: "#4b5263"
  },
  gruvbox: {
    background: "#282828",
    cardBg: "#3c3836",
    text: "#ebdbb2",
    accent: "#fe8019",
    border: "#504945"
  },
  dracula: {
    background: "#282a36",
    cardBg: "#44475a",
    text: "#f8f8f2",
    accent: "#ff79c6",
    border: "#6272a4"
  },
  monokai: {
    background: "#272822",
    cardBg: "#3e3d32",
    text: "#f8f8f2",
    accent: "#a6e22e",
    border: "#49483e"
  },
  chalk: {
    background: "#2d2d2d",
    cardBg: "#393939",
    text: "#d3d0c8",
    accent: "#f2777a",
    border: "#515151"
  },
  nord: {
    background: "#2e3440",
    cardBg: "#3b4252",
    text: "#eceff4",
    accent: "#88c0d0",
    border: "#434c5e"
  },
  alduin: {
    background: "#1c1c1c",
    cardBg: "#262626",
    text: "#d4be98",
    accent: "#ea6962",
    border: "#32302f"
  },
  darkhub: {
    background: "#0d1117",
    cardBg: "#161b22",
    text: "#c9d1d9",
    accent: "#58a6ff",
    border: "#30363d"
  },
  juicyfresh: {
    background: "#1e2320",
    cardBg: "#2d353b",
    text: "#d3c6aa",
    accent: "#a7c080",
    border: "#3d484d"
  },
  buddhism: {
    background: "#2b1810",
    cardBg: "#3d2817",
    text: "#f4e4bc",
    accent: "#d77a49",
    border: "#4a3423"
  },
  oldie: {
    background: "#1e1e1e",
    cardBg: "#2d2d2d",
    text: "#d4d4d4",
    accent: "#ce9178",
    border: "#3e3e3e"
  },
  radical: {
    background: "#141321",
    cardBg: "#1a1823",
    text: "#f5f5f5",
    accent: "#fe428e",
    border: "#2a2837"
  },
  onestar: {
    background: "#0d1117",
    cardBg: "#161b22",
    text: "#c9d1d9",
    accent: "#f85149",
    border: "#30363d"
  },
  discord: {
    background: "#36393f",
    cardBg: "#2f3136",
    text: "#dcddde",
    accent: "#5865f2",
    border: "#40444b"
  },
  algolia: {
    background: "#050f2c",
    cardBg: "#0a1929",
    text: "#ffffff",
    accent: "#00aeff",
    border: "#0f2540"
  },
  gitdimmed: {
    background: "#22272e",
    cardBg: "#2d333b",
    text: "#adbac7",
    accent: "#539bf5",
    border: "#373e47"
  },
  tokyonight: {
    background: "#1a1b26",
    cardBg: "#24283b",
    text: "#c0caf5",
    accent: "#7aa2f7",
    border: "#2f3549"
  },
  matrix: {
    background: "#000000",
    cardBg: "#0d0208",
    text: "#00ff41",
    accent: "#00ff41",
    border: "#003b00"
  },
  apprentice: {
    background: "#262626",
    cardBg: "#303030",
    text: "#bcbcbc",
    accent: "#af5f5f",
    border: "#3a3a3a"
  },
  dark_dimmed: {
    background: "#22272e",
    cardBg: "#2d333b",
    text: "#adbac7",
    accent: "#539bf5",
    border: "#373e47"
  },
  dark_lover: {
    background: "#1e1e2e",
    cardBg: "#313244",
    text: "#cdd6f4",
    accent: "#f38ba8",
    border: "#45475a"
  },
  kimbie_dark: {
    background: "#221a0f",
    cardBg: "#302420",
    text: "#d3af86",
    accent: "#f79a32",
    border: "#3d2817"
  },
  aura: {
    background: "#15141b",
    cardBg: "#1f1d2e",
    text: "#e0def4",
    accent: "#c4a7e7",
    border: "#2a273f"
  },
  vampire: {
    background: "#0d0a0f",
    cardBg: "#000000",
    text: "#dc2626",
    accent: "#dc2626",
    border: "#4a1a4a"
  }
};

function getTheme(name) {
  if (!name) return THEMES.dracula;
  const key = String(name).toLowerCase().replace(/-/g, "_");
  return THEMES[key] || THEMES.dracula;
}

module.exports = { getTheme, THEMES };
  