/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATABASE_URL: string;
  // Voeg hier andere env variabelen toe indien nodig
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
