// "YYYY-MM-DD" in the user's local time zone.
// `date.toISOString().split("T")[0]` gives the UTC date instead, which in
// Bangladesh (UTC+6) is the previous day between 00:00 and 06:00.
export const toLocalYMD = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// A "YYYY-MM-DD" date as local midnight. `new Date("YYYY-MM-DD")` is UTC
// midnight, which west of UTC is still the previous day. Other strings fall
// back to the Date parser.
export const parseLocalYMD = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? "").slice(0, 10));
  if (!match) return new Date(value);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};
