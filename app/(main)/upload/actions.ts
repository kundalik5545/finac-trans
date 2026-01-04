"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";
import { validateExcelData, ModelType, ValidationResult } from "@/lib/validate-excel";
import { getCurrentUserId } from "@/lib/get-session";

export async function uploadExcelData(
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  errors?: Array<{ row: number; field: string; message: string }>;
  insertedCount?: number;
}> {
  try {
    const file = formData.get("file") as File;
    const modelType = formData.get("modelType") as ModelType;

    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    if (!modelType) {
      return {
        success: false,
        message: "No model type provided",
      };
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse Excel file
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (jsonData.length === 0) {
      return {
        success: false,
        message: "Excel file is empty or has no data rows",
      };
    }

    // Validate data
    const validation = validateExcelData(jsonData, modelType);

    if (!validation.isValid) {
      return {
        success: false,
        message: `Validation failed. Please fix the errors and try again.`,
        errors: validation.errors,
      };
    }

    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: "Unauthorized. Please log in to upload data.",
      };
    }

    // Insert data based on model type
    let insertedCount = 0;

    switch (modelType) {
      case "Transaction":
        insertedCount = await insertTransactions(validation.data, userId);
        break;
      case "Category":
        insertedCount = await insertCategories(validation.data, userId);
        break;
      case "SubCategory":
        insertedCount = await insertSubCategories(validation.data, userId);
        break;
    }

    revalidatePath("/upload");
    revalidatePath("/transactions");
    revalidatePath("/categories");

    return {
      success: true,
      message: `Successfully uploaded ${insertedCount} ${modelType.toLowerCase()}${insertedCount !== 1 ? "s" : ""}`,
      insertedCount,
    };
  } catch (error: any) {
    console.error("Error uploading Excel data:", error);
    return {
      success: false,
      message: error.message || "An error occurred while uploading the file",
    };
  }
}

async function insertTransactions(data: any[], userId: string): Promise<number> {
  let insertedCount = 0;

  for (const item of data) {
    try {
      // Find category by name if provided (must belong to user)
      let categoryId = null;
      if (item.categoryName) {
        const category = await prisma.category.findFirst({
          where: {
            name: item.categoryName,
            userId,
          },
        });
        categoryId = category?.id || null;
      }

      // Find subcategory by name and category if provided (must belong to user)
      let subCategoryId = null;
      if (item.subCategoryName && categoryId) {
        const subCategory = await prisma.subCategory.findFirst({
          where: {
            name: item.subCategoryName,
            categoryId: categoryId,
            userId,
          },
        });
        subCategoryId = subCategory?.id || null;
      }

      await prisma.transaction.create({
        data: {
          amount: item.amount,
          date: item.date,
          description: item.description,
          type: item.type,
          status: item.status,
          paymentMethod: item.paymentMethod,
          bankAccountName: item.bankAccountName,
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          userId,
        },
      });

      insertedCount++;
    } catch (error: any) {
      console.error(`Error inserting transaction at row:`, error);
      // Continue with next item
    }
  }

  return insertedCount;
}

async function insertCategories(data: any[], userId: string): Promise<number> {
  let insertedCount = 0;

  for (const item of data) {
    try {
      await prisma.category.create({
        data: {
          name: item.name,
          description: item.description,
          userId,
        },
      });
      insertedCount++;
    } catch (error: any) {
      // Skip if category already exists (unique constraint)
      if (error.code === "P2002") {
        console.log(`Category "${item.name}" already exists for this user, skipping`);
      } else {
        console.error(`Error inserting category:`, error);
      }
    }
  }

  return insertedCount;
}

async function insertSubCategories(data: any[], userId: string): Promise<number> {
  let insertedCount = 0;

  for (const item of data) {
    try {
      // Find category by name (must belong to user)
      const category = await prisma.category.findFirst({
        where: {
          name: item.categoryName,
          userId,
        },
      });

      if (!category) {
        console.error(`Category "${item.categoryName}" not found for this user, skipping subcategory "${item.name}"`);
        continue;
      }

      await prisma.subCategory.create({
        data: {
          name: item.name,
          description: item.description,
          categoryId: category.id,
          userId,
        },
      });
      insertedCount++;
    } catch (error: any) {
      // Skip if subcategory already exists (unique constraint)
      if (error.code === "P2002") {
        console.log(`SubCategory "${item.name}" already exists for category "${item.categoryName}", skipping`);
      } else {
        console.error(`Error inserting subcategory:`, error);
      }
    }
  }

  return insertedCount;
}

