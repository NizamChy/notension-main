// Sending SMS. BulkSMSBD is the provider; tests and local runs use no sender
// at all (see `createAuth`).
export type SmsSender = (phone: string, message: string) => Promise<void>;

// https://bulksmsbd.net/api/smsapi: response_code 202 means accepted.
export const bulkSmsBd =
  (apiKey: string, senderId: string): SmsSender =>
  async (phone, message) => {
    const res = await fetch("https://bulksmsbd.net/api/smsapi", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: apiKey,
        type: "text",
        number: `88${phone}`,
        senderid: senderId,
        message,
      }),
    });
    const data = (await res.json().catch(() => null)) as { response_code?: number; error_message?: string } | null;
    if (!res.ok || data?.response_code !== 202) {
      throw new Error(`SMS not sent (${data?.response_code ?? res.status}): ${data?.error_message ?? "unknown error"}`);
    }
  };

// Bangladeshi mobile numbers as stored: 01XXXXXXXXX. Accepts +880 / 880
// prefixes, spaces and dashes.
export const normalizeBdPhone = (value: unknown): string | null => {
  const digits = String(value ?? "").replace(/[\s-]/g, "").replace(/^\+?880/, "0");
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null;
};
