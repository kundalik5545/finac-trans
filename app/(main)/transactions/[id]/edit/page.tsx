import { getTransaction, getCategories } from "../../actions";
import { notFound } from "next/navigation";
import EditTransactionForm from "./edit-form";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [transaction, categories] = await Promise.all([
    getTransaction(id),
    getCategories(),
  ]);

  if (!transaction) {
    notFound();
  }

  // Convert Prisma Decimal to number for the form
  const transactionForForm = {
    ...transaction,
    amount: Number(transaction.amount),
    description: transaction.description || "",
  };

  return (
    <EditTransactionForm
      transaction={transactionForForm}
      initialCategories={categories}
    />
  );
}

