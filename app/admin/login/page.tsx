import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }
  return <LoginForm />;
}
