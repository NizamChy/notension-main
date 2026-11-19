// URL slug used in every store / category link:
// "Fresh Mart & Co." -> "fresh-mart-co" (keeps Bengali letters).
export const toSlug = (text) =>
  text
    ?.trim()
    .toLowerCase()
    .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
    .replace(/\s+/g, "-");
