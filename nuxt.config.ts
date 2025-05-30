import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  srcDir: "app/",
  devtools: { enabled: false },
  modules: ["@nuxt/fonts", "@nuxt/icon", "shadcn-nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "~/components/ui",
  },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    families: [
      { name: 'Sora', provider: 'google' },
    ],
    experimental: {
      processCSSVariables: true
    }
  }
});
