"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/category-form";
import { SubCategoryForm } from "@/components/sub-category-form";
import { deleteCategory, deleteSubCategory } from "./actions";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string | null;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
}

interface CategoriesPageClientProps {
  initialCategories: Category[];
}

export default function CategoriesPageClient({
  initialCategories,
}: CategoriesPageClientProps) {
  const router = useRouter();
  const [categories] = useState<Category[]>(initialCategories);
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean;
    category?: Category;
  }>({ open: false });
  const [subCategoryDialog, setSubCategoryDialog] = useState<{
    open: boolean;
    subCategory?: SubCategory;
    categoryId?: string;
  }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "category" | "subCategory";
    id: string;
    name: string;
  }>({ open: false, type: "category", id: "", name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteDialog.type === "category") {
        await deleteCategory(deleteDialog.id);
      } else {
        await deleteSubCategory(deleteDialog.id);
      }
      router.refresh();
      setDeleteDialog({ open: false, type: "category", id: "", name: "" });
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-8 sm:py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your transaction categories and sub-categories
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                setSubCategoryDialog({ open: true, categoryId: undefined })
              }
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Sub-Category
            </Button>
            <Button onClick={() => setCategoryDialog({ open: true })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Tag className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">No categories found</p>
                <p className="text-sm text-muted-foreground">
                  Get started by creating your first category
                </p>
              </div>
              <Button onClick={() => setCategoryDialog({ open: true })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sub-Categories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <TableRow>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {category.subCategories.length > 0 ? (
                            category.subCategories.map((subCat) => (
                              <span
                                key={subCat.id}
                                className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                              >
                                {subCat.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No sub-categories
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setCategoryDialog({ open: true, category })
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: "category",
                                id: category.id,
                                name: category.name,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {category.subCategories.map((subCat) => (
                      <TableRow key={subCat.id} className="bg-muted/30">
                        <TableCell className="pl-8">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">└─</span>
                            <span className="text-sm">{subCat.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {subCat.description || "-"}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSubCategoryDialog({
                                  open: true,
                                  subCategory: subCat,
                                  categoryId: category.id,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  type: "subCategory",
                                  id: subCat.id,
                                  name: subCat.name,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Category Dialog */}
      <CategoryForm
        category={categoryDialog.category}
        open={categoryDialog.open}
        onOpenChange={(open) => setCategoryDialog({ open })}
      />

      {/* Sub-Category Dialog */}
      <SubCategoryForm
        subCategory={subCategoryDialog.subCategory}
        categoryId={subCategoryDialog.categoryId}
        categories={categories}
        open={subCategoryDialog.open}
        onOpenChange={(open) => setSubCategoryDialog({ open })}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, type: "category", id: "", name: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteDialog.type === "category" ? "Category" : "Sub-Category"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.name}"? This action
              cannot be undone.
              {deleteDialog.type === "category" && (
                <span className="block mt-2 text-destructive">
                  All sub-categories under this category will also be deleted.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, type: "category", id: "", name: "" })
              }
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

