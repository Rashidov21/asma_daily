import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "harfbuzzjs"],
  // Fonts + HarfBuzz WASM are read from disk at render time; ship them with the function.
  outputFileTracingIncludes: {
    "/api/wallpaper": [
      "./src/lib/wallpaper/fonts/**/*",
      "./node_modules/harfbuzzjs/dist/harfbuzz.wasm",
    ],
  },
};

export default nextConfig;
