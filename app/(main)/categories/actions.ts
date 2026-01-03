"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  if (!name) {
    throw new Error("Category name is required");
  }

  try {
    await prisma.category.create({
      data: {
        name: name as string,
        description: description ? (description as string) : null,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  if (!name) {
    throw new Error("Category name is required");
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: name as string,
        description: description ? (description as string) : null,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export async function createSubCategory(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");

  if (!name || !categoryId) {
    throw new Error("Sub-category name and category are required");
  }

  try {
    await prisma.subCategory.create({
      data: {
        name: name as string,
        description: description ? (description as string) : null,
        categoryId: categoryId as string,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error creating sub-category:", error);
    throw error;
  }
}

export async function updateSubCategory(id: string, formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");

  if (!name || !categoryId) {
    throw new Error("Sub-category name and category are required");
  }

  try {
    await prisma.subCategory.update({
      where: { id },
      data: {
        name: name as string,
        description: description ? (description as string) : null,
        categoryId: categoryId as string,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error updating sub-category:", error);
    throw error;
  }
}

export async function deleteSubCategory(id: string) {
  try {
    await prisma.subCategory.delete({
      where: { id },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    throw error;
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: {
            name: "asc",
          },
        },
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

export async function getCategory(id: string) {
  try {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getSubCategory(id: string) {
  try {
    return await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("Error fetching sub-category:", error);
    return null;
  }
}
