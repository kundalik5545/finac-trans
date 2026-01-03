"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createTransaction } from "@/app/transactions/actions";
import { Plus, Loader2 } from "lucide-react";

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

interface TransactionFormProps {
  initialCategories: Category[];
}

export function TransactionForm({ initialCategories }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

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
      await createTransaction(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Transaction
        </CardTitle>
        <CardDescription>
          Record a new income, expense, investment, or transfer transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Amount and Date Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                required
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Enter transaction description"
              required
              className="w-full"
            />
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Transaction Type <span className="text-destructive">*</span>
              </Label>
              <Select id="type" name="type" required className="w-full">
                <option value="">Select type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="INVESTMENT">Investment</option>
                <option value="TRANSFER">Transfer</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue="COMPLETED" className="w-full">
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </Select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select id="paymentMethod" name="paymentMethod" className="w-full">
              <option value="">Select payment method (optional)</option>
              <option value="UPI">UPI</option>
              <option value="ONLINE">Online</option>
              <option value="CARD">Card</option>
              <option value="BANK">Bank Transfer</option>
              <option value="WALLET">Wallet</option>
            </Select>
          </div>

          {/* Category and SubCategory Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                id="categoryId"
                name="categoryId"
                className="w-full"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select category (optional)</option>
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
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Create categories first to organize your transactions
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subCategoryId">Sub Category</Label>
              <Select
                id="subCategoryId"
                name="subCategoryId"
                className="w-full"
                disabled={!selectedCategoryId || subCategories.length === 0}
              >
                <option value="">Select sub category (optional)</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

