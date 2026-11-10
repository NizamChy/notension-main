// Safe price helpers: missing / non-numeric values count as 0 instead of
// turning the whole total into NaN.
export const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const lineTotal = (item) =>
  toNumber(item?.sale_price) * toNumber(item?.quantity);

export const sumLineTotals = (items = []) =>
  items.reduce((sum, item) => sum + lineTotal(item), 0);
