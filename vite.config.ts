import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.1.141:8000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
    host: true,
    // port: 3000,
  },

  // base: "/veedhi/",
  build: {
    outDir: "veedhiii",
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
