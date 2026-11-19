export const slugify = (text, maxLength = 100) => {
  if (!text) return "";

  return text
    ?.trim()
    .toString()
    .toLowerCase()
    .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/\.+/g, "-") // Dots to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to single
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, "") // Trim hyphens from end
    .substring(0, maxLength);
};
