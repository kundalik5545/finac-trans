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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { createTransaction } from "@/app/(main)/transactions/actions";
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
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [transactionType, setTransactionType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
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
      // Set transaction type based on selection
      formData.set("type", transactionType);
      await createTransaction(formData);
      setOpen(false);
      // Reset form
      setAmount("");
      setSelectedDate(new Date());
      setSelectedCategoryId("");
      setTransactionType("EXPENSE");
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
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={transactionType === "EXPENSE" ? "default" : "outline"}
                className={`h-16 flex-col gap-2 ${transactionType === "EXPENSE"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setTransactionType("EXPENSE")}
              >
                <ArrowDownLeft
                  className={`h-5 w-5 ${transactionType === "EXPENSE" ? "text-red-400" : "text-muted-foreground"
                    }`}
                />
                <span className="font-medium">Expense (Debit)</span>
              </Button>
              <Button
                type="button"
                variant={transactionType === "INCOME" ? "default" : "outline"}
                className={`h-16 flex-col gap-2 ${transactionType === "INCOME"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setTransactionType("INCOME")}
              >
                <ArrowUpRight
                  className={`h-5 w-5 ${transactionType === "INCOME" ? "text-green-400" : "text-muted-foreground"
                    }`}
                />
                <span className="font-medium">Income (Credit)</span>
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
                <Select id="paymentMethod" name="paymentMethod" className="w-full">
                  <option value="">Select Payment Method</option>
                  <option value="CARD">Credit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="ONLINE">Online</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="WALLET">Wallet</option>
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
                <Input
                  id="status"
                  name="status"
                  defaultValue="Completed"
                  readOnly
                  className="w-full bg-muted"
                />
                <input type="hidden" name="status" value="COMPLETED" />
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

              {/* Bank Account (Optional - not in schema but shown in image) */}
              <div className="space-y-2">
                <Label htmlFor="bankAccount" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank Account
                </Label>
                <Select id="bankAccount" name="bankAccount" className="w-full">
                  <option value="">Select Bank Account</option>
                  <option value="main">Main Checking (**** 1234)</option>
                  <option value="savings">Savings Account (**** 5678)</option>
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
