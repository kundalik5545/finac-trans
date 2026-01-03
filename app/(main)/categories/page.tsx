import { getCategories } from "./actions";
import CategoriesPageClient from "./page-client";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return <CategoriesPageClient initialCategories={categories} />;
}

