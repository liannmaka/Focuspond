import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FocusPond - Mood-Aware Productivity",
    short_name: "FocusPond",
    description: "Stay focused and productive with mood-based task suggestions",
    // The app, not the marketing page. Tapping a home-screen icon and
    // landing on the website is the clearest way to look unfinished.
    start_url: "/home/today",
    display: "standalone",
    // Both match --surface (light) in src/styles/globals.css so the splash and
    // browser chrome are continuous with the app's ground.
    background_color: "#f1f4f3",
    theme_color: "#f1f4f3",
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
      {
        src: "/icons/maskable-icon-640x640.png",
        sizes: "640x640",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
    orientation: "portrait",
  };
}
