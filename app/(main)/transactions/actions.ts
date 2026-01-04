"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/get-session";

export async function createTransaction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");
  const type = formData.get("type");
  const status = formData.get("status") || "COMPLETED";
  const paymentMethod = formData.get("paymentMethod");
  const categoryId = formData.get("categoryId");
  const subCategoryId = formData.get("subCategoryId");

  if (!amount || !date || !description || !type) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.transaction.create({
      data: {
        amount: parseFloat(amount as string),
        date: new Date(date as string),
        description: description as string,
        type: type as "INCOME" | "EXPENSE" | "INVESTMENT" | "TRANSFER",
        status: status as "COMPLETED" | "PENDING" | "FAILED",
        paymentMethod: paymentMethod
          ? (paymentMethod as "UPI" | "ONLINE" | "CARD" | "BANK" | "WALLET")
          : null,
        bankAccountName: formData.get("bankAccountName")
          ? (formData.get("bankAccountName") as "SBI" | "AXIS" | "FEDERAL_BANK" | "SBI_CARD" | "ICICI_CARD")
          : null,
        categoryId: categoryId ? (categoryId as string) : null,
        subCategoryId: subCategoryId ? (subCategoryId as string) : null,
        userId,
      },
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function getCategories() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  try {
    return await prisma.category.findMany({
      where: {
        userId,
      },
      include: {
        subCategories: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getTransaction(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
      },
    });

    // Verify ownership
    if (transaction && transaction.userId !== userId) {
      return null;
    }

    return transaction;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");
  const type = formData.get("type");
  const status = formData.get("status") || "COMPLETED";
  const paymentMethod = formData.get("paymentMethod");
  const bankAccountName = formData.get("bankAccountName");
  const categoryId = formData.get("categoryId");
  const subCategoryId = formData.get("subCategoryId");

  if (!amount || !date || !description || !type) {
    throw new Error("Missing required fields");
  }

  try {
    // Verify ownership before updating
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        amount: parseFloat(amount as string),
        date: new Date(date as string),
        description: description as string,
        type: type as "INCOME" | "EXPENSE" | "INVESTMENT" | "TRANSFER",
        status: status as "COMPLETED" | "PENDING" | "FAILED",
        paymentMethod: paymentMethod
          ? (paymentMethod as "UPI" | "ONLINE" | "CARD" | "BANK" | "WALLET")
          : null,
        bankAccountName: bankAccountName
          ? (bankAccountName as "SBI" | "AXIS" | "FEDERAL_BANK" | "SBI_CARD" | "ICICI_CARD")
          : null,
        categoryId: categoryId ? (categoryId as string) : null,
        subCategoryId: subCategoryId ? (subCategoryId as string) : null,
      },
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

export async function deleteTransaction(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify ownership before deleting
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/transactions");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

export async function getTransactions(page: number = 1, pageSize: number = 10) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      transactions: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
      },
    };
  }

  try {
    const skip = (page - 1) * pageSize;
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId,
        },
        skip,
        take: pageSize,
        include: {
          category: true,
          subCategory: true,
        },
        orderBy: {
          date: "desc",
        },
      }),
      prisma.transaction.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      transactions: [],
      pagination: {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export async function getAllTransactions() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return [];
  }

  try {
    return await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
        subCategory: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return [];
  }
}

