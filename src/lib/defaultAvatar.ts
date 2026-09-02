/**
 * Generic clean professional silhouette avatar for CV templates when no user photo is uploaded yet.
 * Crisp SVG data URI with neutral slate tones, rendering instantly without network latency or CORS issues.
 */
export const DEFAULT_AVATAR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f1f5f9'/%3E%3Ccircle cx='80' cy='60' r='28' fill='%2394a3b8'/%3E%3Cpath d='M26 142c0-29.822 24.178-54 54-54s54 24.178 54 54' fill='%2394a3b8'/%3E%3C/svg%3E";

/**
 * Returns user uploaded photo URL if present and valid,
 * otherwise returns the standard professional silhouette placeholder.
 */
export const getProfilePhoto = (photoUrl?: string | null): string => {
  if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim().length > 0) {
    return photoUrl.trim();
  }
  return DEFAULT_AVATAR_PLACEHOLDER;
};

/**
 * Checks if the given photo is empty or the placeholder avatar.
 */
export const isPlaceholderPhoto = (photoUrl?: string | null): boolean => {
  if (!photoUrl || !photoUrl.trim()) return true;
  return photoUrl === DEFAULT_AVATAR_PLACEHOLDER;
};
