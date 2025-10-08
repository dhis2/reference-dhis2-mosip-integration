/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PHN_ROUTE_NAME: string
  // add other env variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
