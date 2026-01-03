"use client";

import { useState, useEffect } from "react";
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
import { createTransaction } from "@/app/(main)/transactions/actions";
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
  Plus,
  Loader2,
  Calendar,
  Tag,
  CreditCard,
  CheckCircle,
  Building2,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

interface AddTransactionFormProps {
  initialCategories: Category[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  transactionId?: string;
}

export function AddTransactionForm({
  initialCategories,
  open: controlledOpen,
  onOpenChange,
}: AddTransactionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Sync categories state with prop changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    // Format as datetime-local string (YYYY-MM-DDTHH:mm)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("INR");
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.COMPLETED);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.UPI);
  const [bankAccountName, setBankAccountName] = useState<BankAccountName>(BankAccountName.SBI_CARD);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((cat) => cat.id === selectedCategoryId);
      setSubCategories(category?.subCategories || []);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategoryId, categories]);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      // Set transaction type, status, payment method, and bank account based on selection
      formData.set("type", transactionType);
      formData.set("status", status);
      formData.set("paymentMethod", paymentMethod);
      formData.set("bankAccountName", bankAccountName);
      await createTransaction(formData);
      // Reset form
      setAmount("");
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      setSelectedCategoryId("");
      setTransactionType(TransactionType.EXPENSE);
      setStatus(TransactionStatus.COMPLETED);
      setPaymentMethod(PaymentMethod.UPI);
      setBankAccountName(BankAccountName.SBI_CARD);
      setIsSubmitting(false);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense entry.</DialogDescription>
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
                  step="1"
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
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </Select>
            </div>
          </div>

          {/* Transaction Type Selection */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                type="button"
                variant="outline"
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.EXPENSE
                  ? "bg-red-500 text-white border-red-500 hover:bg-red-500"
                  : "bg-red-100 text-red-900 border-red-200 hover:bg-red-200"
                  }`}
                onClick={() => setTransactionType(TransactionType.EXPENSE)}
              >
                <ArrowDownLeft
                  className={`h-5 w-5 ${transactionType === TransactionType.EXPENSE ? "text-white" : "text-red-600"
                    }`}
                />
                <span className="font-medium text-xs">Expense</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.INCOME
                  ? "bg-green-500 text-white border-green-500 hover:bg-green-500"
                  : "bg-green-100 text-green-900 border-green-200 hover:bg-green-200"
                  }`}
                onClick={() => setTransactionType(TransactionType.INCOME)}
              >
                <ArrowUpRight
                  className={`h-5 w-5 ${transactionType === TransactionType.INCOME ? "text-white" : "text-green-600"
                    }`}
                />
                <span className="font-medium text-xs">Income</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.INVESTMENT
                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-500"
                  : "bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200"
                  }`}
                onClick={() => setTransactionType(TransactionType.INVESTMENT)}
              >
                <ArrowUpRight
                  className={`h-5 w-5 ${transactionType === TransactionType.INVESTMENT ? "text-white" : "text-blue-600"
                    }`}
                />
                <span className="font-medium text-xs">Investment</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-16 flex-col gap-2 ${transactionType === TransactionType.TRANSFER
                  ? "bg-purple-500 text-white border-purple-500 hover:bg-purple-500"
                  : "bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200"
                  }`}
                onClick={() => setTransactionType(TransactionType.TRANSFER)}
              >
                <ArrowDownLeft
                  className={`h-5 w-5 ${transactionType === TransactionType.TRANSFER ? "text-white" : "text-purple-600"
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
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full"
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
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
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
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
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
                  disabled={!selectedCategoryId || subCategories.length === 0}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </Select>
                {!selectedCategoryId && (
                  <p className="text-xs text-muted-foreground">
                    Select a category first
                  </p>
                )}
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
                  onChange={(e) => setBankAccountName(e.target.value as BankAccountName)}
                >
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
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Transaction
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
