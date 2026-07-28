import type { Metadata } from "next";
import AuthForm from "../_components/AuthForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
