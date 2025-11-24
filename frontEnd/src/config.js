const browserOrigin =
  typeof window !== "undefined" ? window.location.origin : "";

const DEV_FALLBACK_BASE_URL = browserOrigin || "http://localhost:5000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEV_FALLBACK_BASE_URL;

export const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_BASE_URL || API_BASE_URL;

export function buildAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${ASSET_BASE_URL}${path}`;
}
