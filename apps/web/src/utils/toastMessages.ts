// Toast wording helpers, kept free of React so they are easy to test.

export const GENERIC_ERROR = "Something went wrong. Please try again.";

// Text that should never reach a customer: stack traces, HTTP/library errors,
// "undefined" and friends.
const TECHNICAL =
  /\b(undefined|null|NaN|exception|TypeError|ReferenceError|SyntaxError|ECONN\w*|ETIMEDOUT|ENOTFOUND|status code|Network Error|timeout of|Failed to fetch|Internal Server Error|Cast to|E11000|validation failed)\b|\[object|<\/?[a-z][^>]*>/i;

// A server message when it is a readable sentence, otherwise the fallback.
export const friendlyMessage = (message, fallback = GENERIC_ERROR) => {
  if (typeof message !== "string") return fallback;
  const text = message.trim();
  if (!text || text.length > 160 || TECHNICAL.test(text)) return fallback;
  return text;
};

// The API's `message` from an axios error, or a friendly fallback.
export const errorMessage = (error, fallback = GENERIC_ERROR) =>
  friendlyMessage(error?.response?.data?.message, fallback);
