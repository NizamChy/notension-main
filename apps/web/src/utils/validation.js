// True when the trimmed text length is within [min, max].
export const isLengthBetween = (text, min, max) => {
  const length = String(text ?? "").trim().length;
  return length >= min && length <= max;
};
