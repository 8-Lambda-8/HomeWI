// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  routeRules: {
    "/": { prerender: true },
    "/api/*": { cache: { maxAge: 1 * 60 } },
  },
  runtimeConfig: {
    lstApiUsername: '',
    lstApiPassword: '',
  },

  modules: [
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxt/fonts",
    // "@nuxt/content",
    "@nuxt/ui",
    "@nuxt/scripts",
    "@nuxt/test-utils",
  ],
});
