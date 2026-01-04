import UploadPageClient from "./page-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  return <UploadPageClient />;
}
