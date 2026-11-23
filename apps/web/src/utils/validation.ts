// True when the trimmed text length is within [min, max].
export const isLengthBetween = (text: unknown, min: number, max: number) => {
  const length = String(text ?? "").trim().length;
  return length >= min && length <= max;
};
