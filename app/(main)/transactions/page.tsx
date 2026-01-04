import { headers } from "next/headers";
import { getCategories, getTransactions } from "./actions";
import TransactionsPageClient from "./page-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }


  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const categories = await getCategories();
  const { transactions, pagination } = await getTransactions(page, 10);

  // Convert Prisma Decimal to number for client component
  const transactionsForClient = transactions.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));

  return (
    <TransactionsPageClient
      categories={categories}
      initialTransactions={transactionsForClient}
      initialPagination={pagination}
    />
  );
}
