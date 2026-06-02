import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

interface ThemeState {
  mode: Theme;
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (mode: Theme) => {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem("theme", mode);
};

const initialState: ThemeState = { mode: getInitialTheme() };
applyTheme(initialState.mode);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      applyTheme(action.payload);
    },
    // toggleTheme: (state) => {
    //   state.mode = state.mode === 'light' ? 'dark' : 'light';
    //   applyTheme(state.mode);
    // },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
