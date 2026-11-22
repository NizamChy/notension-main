// @vitest-environment jsdom
import { customer } from "@notension/shared";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { z } from "zod";
import { FormField } from "@/components/shared/UI/FormField";
import { useZodForm } from "./useZodForm";

afterEach(cleanup);

const schema = z.object({ phone: customer.bdPhone });

function PhoneForm() {
  const form = useZodForm(schema, { defaultValues: { phone: "" } });
  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <FormField label="Mobile" error={form.formState.errors.phone?.message}>
        {(props) => <input {...props} {...form.register("phone")} />}
      </FormField>
      <button type="submit">Send</button>
    </form>
  );
}

test("shows the Zod message after an invalid submit", async () => {
  render(<PhoneForm />);
  fireEvent.change(screen.getByLabelText("Mobile"), { target: { value: "123" } });
  fireEvent.click(screen.getByText("Send"));
  await waitFor(() =>
    expect(screen.getByText("Enter a valid mobile number (01XXXXXXXXX)")).toBeTruthy(),
  );
  const input = screen.getByLabelText("Mobile");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")).toBe(
    screen.getByRole("alert").getAttribute("id"),
  );
  expect(input.getAttribute("aria-describedby")).toBeTruthy();
});
