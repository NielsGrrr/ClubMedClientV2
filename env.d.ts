/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // On explique à TypeScript que tous les fichiers .vue sont des composants Vue valides
  const component: DefineComponent<{}, {}, any>
  export default component
}