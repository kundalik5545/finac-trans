"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { updateTransaction } from "@/app/(main)/transactions/actions";
import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  BankAccountName,
  getTransactionTypeLabel,
  getTransactionStatusLabel,
  getPaymentMethodLabel,
  getBankAccountLabel,
} from "@/lib/transaction-enums";
import {
  Loader2,
  Calendar,
  Tag,
  CreditCard,
  CheckCircle,
  Building2,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";

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
  description: string;
  type: string;
  status: string;
  paymentMethod: string | null;
  bankAccountName: string | null;
  categoryId: string | null;
  subCategoryId: string | null;
}

interface EditTransactionFormProps {
  transaction: Transaction;
  initialCategories: Category[];
}

export default function EditTransactionForm({
  transaction,
  initialCategories,
}: EditTransactionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Sync categories state with prop changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    transaction.categoryId || ""
  );
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(transaction.date)
  );
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [currency, setCurrency] = useState<string>("USD");
  const [transactionType, setTransactionType] = useState<TransactionType>(
    (transaction.type as TransactionType) || TransactionType.EXPENSE
  );
  const [status, setStatus] = useState<TransactionStatus>(
    (transaction.status as TransactionStatus) || TransactionStatus.COMPLETED
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(
    (transaction.paymentMethod as PaymentMethod) || ""
  );
  const [bankAccountName, setBankAccountName] = useState<BankAccountName | "">(
    (transaction.bankAccountName as BankAccountName) || ""
  );
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((cat) => cat.id === selectedCategoryId);
      setSubCategories(category?.subCategories || []);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (transaction.categoryId) {
      const category = categories.find(
        (cat) => cat.id === transaction.categoryId
      );
      if (category) {
        setSubCategories(category.subCategories);
      }
    }
  }, [transaction.categoryId, categories]);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      formData.set("type", transactionType);
      formData.set("status", status);
      if (paymentMethod) {
        formData.set("paymentMethod", paymentMethod);
      }
      if (bankAccountName) {
        formData.set("bankAccountName", bankAccountName);
      }
      await updateTransaction(transaction.id, formData);
      setOpen(false);
      router.push("/transactions");
      router.refresh();
    } catch (error) {
      console.error("Error updating transaction:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        router.push("/transactions");
      }
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Update transaction details.</DialogDescription>
          <DialogClose />
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6 p-6 pt-0">
          {/* Transaction Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Transaction Amount</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                  {currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹"}
                </span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg font-semibold h-14"
                />
              </div>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-32"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </div>
          </div>

          {/* Transaction Type Selection */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                type="button"
                variant={transactionType === TransactionType.EXPENSE ? "default" : "outline"}
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.EXPENSE
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setTransactionType(TransactionType.EXPENSE)}
              >
                <ArrowDownLeft
                  className={`h-5 w-5 ${transactionType === TransactionType.EXPENSE ? "text-red-400" : "text-muted-foreground"
                    }`}
                />
                <span className="font-medium text-xs">Expense</span>
              </Button>
              <Button
                type="button"
                variant={transactionType === TransactionType.INCOME ? "default" : "outline"}
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.INCOME
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setTransactionType(TransactionType.INCOME)}
              >
                <ArrowUpRight
                  className={`h-5 w-5 ${transactionType === TransactionType.INCOME ? "text-green-400" : "text-muted-foreground"
                    }`}
                />
                <span className="font-medium text-xs">Income</span>
              </Button>
              <Button
                type="button"
                variant={transactionType === TransactionType.INVESTMENT ? "default" : "outline"}
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.INVESTMENT
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setTransactionType(TransactionType.INVESTMENT)}
              >
                <ArrowUpRight
                  className={`h-5 w-5 ${transactionType === TransactionType.INVESTMENT ? "text-blue-400" : "text-muted-foreground"
                    }`}
                />
                <span className="font-medium text-xs">Investment</span>
              </Button>
              <Button
                type="button"
                variant={transactionType === TransactionType.TRANSFER ? "default" : "outline"}
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.TRANSFER
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setTransactionType(TransactionType.TRANSFER)}
              >
                <ArrowDownLeft
                  className={`h-5 w-5 ${transactionType === TransactionType.TRANSFER ? "text-purple-400" : "text-muted-foreground"
                    }`}
                />
                <span className="font-medium text-xs">Transfer</span>
              </Button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <DateTimePicker
                  name="date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </Label>
                <Select
                  id="categoryId"
                  name="categoryId"
                  className="w-full"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </Label>
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="w-full"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod | "")}
                >
                  <option value="">Select Payment Method</option>
                  {Object.values(PaymentMethod).map((method) => (
                    <option key={method} value={method}>
                      {getPaymentMethodLabel(method)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Status
                </Label>
                <Select
                  id="status"
                  name="status"
                  className="w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                >
                  {Object.values(TransactionStatus).map((statusValue) => (
                    <option key={statusValue} value={statusValue}>
                      {getTransactionStatusLabel(statusValue)}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Sub Category */}
              <div className="space-y-2">
                <Label htmlFor="subCategoryId" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Sub Category
                </Label>
                <Select
                  id="subCategoryId"
                  name="subCategoryId"
                  className="w-full"
                  defaultValue={transaction.subCategoryId || ""}
                  disabled={!selectedCategoryId || subCategories.length === 0}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Bank Account */}
              <div className="space-y-2">
                <Label htmlFor="bankAccountName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank Account
                </Label>
                <Select
                  id="bankAccountName"
                  name="bankAccountName"
                  className="w-full"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value as BankAccountName | "")}
                >
                  <option value="">Select Bank Account</option>
                  {Object.values(BankAccountName).map((account) => (
                    <option key={account} value={account}>
                      {getBankAccountLabel(account)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Information
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add notes, descriptions, or tags..."
              className="min-h-[100px]"
              required
              defaultValue={transaction.description}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                router.push("/transactions");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Transaction"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

