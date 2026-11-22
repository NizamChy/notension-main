import { z } from "zod";

// The store checkout form. The 500 limit matches `placeOrderInput.shortNote`
// in the shared contract; a longer note used to be dropped by the API.
export const checkoutFormSchema = z.object({
  remarks: z.string().max(500, "Keep the note under 500 characters"),
  paymentOption: z.string().min(1),
});

export type CheckoutForm = z.infer<typeof checkoutFormSchema>;
