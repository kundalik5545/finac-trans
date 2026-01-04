import { getCategories } from "./actions";
import CategoriesPageClient from "./page-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
    const session = await auth();
    if (!session) {
        redirect("/auth/login");
    }

    const categories = await getCategories();

    return <CategoriesPageClient initialCategories={categories} />;
}

