// URL slug used in every store / category link:
// "Fresh Mart & Co." -> "fresh-mart-co" (keeps Bengali letters).
// It never contains "_", so links can join a slug and an id with "_".
export const toSlug = (text: string | null | undefined): string | undefined =>
  text
    ?.trim()
    .toLowerCase()
    .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
    .replace(/\s+/g, "-");
