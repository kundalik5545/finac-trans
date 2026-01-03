"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { AddTransactionForm } from "@/components/add-transaction-form";
import { TransactionsTable } from "@/components/transactions-table";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string | null;
  type: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  paymentMethod: "UPI" | "ONLINE" | "CARD" | "BANK" | "WALLET" | null;
  bankAccountName: "SBI" | "AXIS" | "FEDERAL_BANK" | "SBI_CARD" | "ICICI_CARD" | null;
  category: { name: string } | null;
  subCategory: { name: string } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function TransactionsPageClient({
  categories,
  initialTransactions,
  initialPagination,
}: {
  categories: Category[];
  initialTransactions: Transaction[];
  initialPagination: Pagination;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <main className="container flex flex-1 flex-col gap-8 px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">Transactions</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <TransactionsTable
          initialTransactions={initialTransactions}
          initialPagination={initialPagination}
        />
      </main>
      <AddTransactionForm
        initialCategories={categories}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

