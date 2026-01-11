import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/anime-character-lab/",
  plugins: [react()],
});
