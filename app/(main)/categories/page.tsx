import { redirect } from "next/navigation";
import { getCategories } from "./actions";
import CategoriesPageClient from "./page-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CategoriesPage() {

    // Check if user is authenticated
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }


    const categories = await getCategories();

    return <CategoriesPageClient initialCategories={categories} />;
}

