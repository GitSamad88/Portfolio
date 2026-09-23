import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return <AdminShell />;
}
