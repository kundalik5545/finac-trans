"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
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
        categoryId: categoryId ? (categoryId as string) : null,
        subCategoryId: subCategoryId ? (subCategoryId as string) : null,
      },
    });

    revalidatePath("/transactions");
    redirect("/transactions");
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
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

