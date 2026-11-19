// "YYYY-MM-DD" in the user's local time zone.
// `date.toISOString().split("T")[0]` gives the UTC date instead, which in
// Bangladesh (UTC+6) is the previous day between 00:00 and 06:00.
export const toLocalYMD = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
