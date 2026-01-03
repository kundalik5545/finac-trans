import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container flex flex-1 flex-col gap-8 px-4 py-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg text-muted-foreground">
              Your transactions will appear here
            </p>
            <p className="text-sm text-muted-foreground">
              Start by adding your first transaction
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

