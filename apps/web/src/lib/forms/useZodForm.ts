import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

/** `useForm` wired to a Zod schema; errors show once a field is touched. */
export function useZodForm<S extends z.ZodType<FieldValues, FieldValues>>(
  schema: S,
  options?: Omit<UseFormProps<z.infer<S>>, "resolver">,
): UseFormReturn<z.infer<S>> {
  return useForm<z.infer<S>>({
    mode: "onTouched",
    ...options,
    // zodResolver types input and output separately; the form holds one shape.
    resolver: zodResolver(schema) as unknown as Resolver<z.infer<S>>,
  });
}
