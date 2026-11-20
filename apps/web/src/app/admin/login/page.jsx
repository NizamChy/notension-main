import Link from "next/link";
import AuthCard from "@/components/Admin/AuthCard";
import LoginForm from "@/components/Admin/LoginForm";

export const metadata = { title: "Staff login" };

export default function AdminLoginPage() {
  return (
    <AuthCard
      title="Staff login"
      subtitle="For NoTension staff and store teams only."
      footer={
        <>
          Shopping with us?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Customers log in on the main site
          </Link>
          .
          <br />
          New staff: open the setup link you were sent to choose your password.
          <br />
          Trying the demo?{" "}
          <Link href="/demo-accounts" className="font-medium text-primary hover:underline">
            See every demo account
          </Link>
          .
          <br />
          How does it all work?{" "}
          <Link href="/guide" className="font-medium text-primary hover:underline">
            Read the project guide
          </Link>
          .
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
