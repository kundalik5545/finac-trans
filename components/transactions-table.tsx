"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Edit, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteTransaction } from "@/app/(main)/transactions/actions";
import { exportToExcel, TransactionExport } from "@/lib/export-excel";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string | null;
  type: string;
  status: string;
  paymentMethod: string | null;
  bankAccountName: string | null;
  category: { name: string } | null;
  subCategory: { name: string } | null;
}

interface TransactionsTableProps {
  initialTransactions: Transaction[];
  initialPagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function TransactionsTable({
  initialTransactions,
  initialPagination,
}: TransactionsTableProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [isExporting, setIsExporting] = useState(false);

  const fetchTransactions = async (page: number) => {
    try {
      const response = await fetch(`/api/transactions?page=${page}&pageSize=${pagination.pageSize}`);
      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteTransaction(id);
      router.refresh();
      // Refetch transactions
      if (transactions.length === 1 && currentPage > 1) {
        await fetchTransactions(currentPage - 1);
      } else {
        await fetchTransactions(currentPage);
      }
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/transactions?export=true");
      const data = await response.json();
      const exportData: TransactionExport[] = data.transactions.map((t: Transaction) => ({
        id: t.id,
        date: format(new Date(t.date), "yyyy-MM-dd HH:mm"),
        amount: Number(t.amount),
        type: t.type,
        status: t.status,
        description: t.description,
        paymentMethod: t.paymentMethod,
        bankAccountName: t.bankAccountName,
        category: t.category?.name || null,
        subCategory: t.subCategory?.name || null,
      }));
      exportToExcel(exportData);
    } catch (error) {
      console.error("Error exporting transactions:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "text-green-600 bg-green-50";
      case "EXPENSE":
        return "text-red-600 bg-red-50";
      case "INVESTMENT":
        return "text-blue-600 bg-blue-50";
      case "TRANSFER":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
        <p className="text-lg text-muted-foreground">No transactions found</p>
        <p className="text-sm text-muted-foreground">Start by adding your first transaction</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Transactions</h2>
            <p className="text-sm text-muted-foreground">
              Showing {transactions.length} of {pagination.total} transactions
            </p>
          </div>
          <Button onClick={handleExport} disabled={isExporting} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export to Excel"}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.date), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₹{Number(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.description || "-"}
                  </TableCell>
                  <TableCell>
                    {transaction.category?.name || "-"}
                    {transaction.subCategory && ` / ${transaction.subCategory.name}`}
                  </TableCell>
                  <TableCell>{transaction.paymentMethod || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog({ open: true, id: transaction.id })}
                        disabled={isDeleting === transaction.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTransactions(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTransactions(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
              disabled={isDeleting === deleteDialog.id}
            >
              {isDeleting === deleteDialog.id ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

