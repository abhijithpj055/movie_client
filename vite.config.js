import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No tailwindcss() here
export default defineConfig({
  plugins: [react()],
});
