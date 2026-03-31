// Shared runtime configuration

// The Netlify serverless function URL.
// VITE_DATABASE_URL is embedded at build time by Vite.  We fall back to the
// standard Netlify function path so the app works even when the env var is
// not explicitly configured in the Netlify build settings.
export const DB_URL =
  (import.meta.env.VITE_DATABASE_URL as string | undefined) ??
  '/.netlify/functions/database';
