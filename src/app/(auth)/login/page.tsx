import type { Metadata } from "next";
import AuthForm from "../_components/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
