import { getCategories, getTransactions } from "./actions";
import TransactionsPageClient from "./page-client";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
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
