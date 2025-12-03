import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FocusPond - Mood-Aware Productivity",
    short_name: "FocusPond",
    description: "Stay focused and productive with mood-based task suggestions",
    start_url: "/today",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff9472",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    orientation: "portrait",
  };
}
