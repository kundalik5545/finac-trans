"use client";

import React, { useState } from "react";
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
import { createSubCategory, updateSubCategory } from "@/app/(main)/categories/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
}

interface SubCategoryFormProps {
  subCategory?: SubCategory;
  categoryId?: string;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubCategoryForm({
  subCategory,
  categoryId: initialCategoryId,
  categories,
  open,
  onOpenChange,
}: SubCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(subCategory?.name || "");
  const [description, setDescription] = useState(subCategory?.description || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    subCategory?.categoryId || initialCategoryId || ""
  );

  React.useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
      setDescription(subCategory.description || "");
      setSelectedCategoryId(subCategory.categoryId);
    } else {
      setName("");
      setDescription("");
      setSelectedCategoryId(initialCategoryId || "");
    }
  }, [subCategory, initialCategoryId, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("categoryId", selectedCategoryId);

      if (subCategory) {
        await updateSubCategory(subCategory.id, formData);
      } else {
        await createSubCategory(formData);
      }

      // Reset form state
      setName("");
      setDescription("");
      setSelectedCategoryId(initialCategoryId || "");
      setIsSubmitting(false);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving sub-category:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {subCategory ? "Edit Sub-Category" : "Add Sub-Category"}
          </DialogTitle>
          <DialogDescription>
            {subCategory
              ? "Update sub-category details"
              : "Create a new sub-category under a category"}
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              id="categoryId"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
              className="w-full"
              disabled={!!subCategory}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {subCategory && (
              <p className="text-xs text-muted-foreground">
                Category cannot be changed when editing
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Sub-Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries, Restaurants, Fast Food"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this sub-category"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedCategoryId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : subCategory ? (
                "Update Sub-Category"
              ) : (
                "Create Sub-Category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

