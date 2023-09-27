/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly DS_RENDERER_URL: string

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
