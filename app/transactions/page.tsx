import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/components/transaction-form";
import { getCategories } from "@/app/transactions/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TransactionsPage() {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container flex flex-1 flex-col gap-8 px-4 py-8 sm:py-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">Transactions</h1>
        </div>
        
        <div className="mx-auto w-full max-w-4xl">
          <TransactionForm initialCategories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

