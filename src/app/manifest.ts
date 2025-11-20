import type { MetadataRoute } from "next";
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Focuspond",
    short_name: "Focuspond",
    description: "Stay focused, stay productive",
    start_url: "/app",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#000",
    // icons: [
    //   {
    //     src: "/icon-192x192.png",
    //     sizes: "192x192",
    //     type: "image/png",
    //   },
    //   {
    //     src: "/icon-512x512.png",
    //     sizes: "512x512",
    //     type: "image/png",
    //   },
    // ],
  };
}  