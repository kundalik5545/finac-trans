"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/get-session";

export async function createCategory(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

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
        userId,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name");
  const description = formData.get("description");

  if (!name) {
    throw new Error("Category name is required");
  }

  try {
    // Verify ownership
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory || existingCategory.userId !== userId) {
      throw new Error("Unauthorized");
    }

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
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify ownership
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory || existingCategory.userId !== userId) {
      throw new Error("Unauthorized");
    }

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
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");

  if (!name || !categoryId) {
    throw new Error("Sub-category name and category are required");
  }

  try {
    // Verify category ownership
    const category = await prisma.category.findUnique({
      where: { id: categoryId as string },
    });

    if (!category || category.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.subCategory.create({
      data: {
        name: name as string,
        description: description ? (description as string) : null,
        categoryId: categoryId as string,
        userId,
      },
    });

    revalidatePath("/categories");
  } catch (error) {
    console.error("Error creating sub-category:", error);
    throw error;
  }
}

export async function updateSubCategory(id: string, formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const categoryId = formData.get("categoryId");

  if (!name || !categoryId) {
    throw new Error("Sub-category name and category are required");
  }

  try {
    // Verify ownership
    const existingSubCategory = await prisma.subCategory.findUnique({
      where: { id },
    });

    if (!existingSubCategory || existingSubCategory.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Verify category ownership
    const category = await prisma.category.findUnique({
      where: { id: categoryId as string },
    });

    if (!category || category.userId !== userId) {
      throw new Error("Unauthorized");
    }

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
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify ownership
    const existingSubCategory = await prisma.subCategory.findUnique({
      where: { id },
    });

    if (!existingSubCategory || existingSubCategory.userId !== userId) {
      throw new Error("Unauthorized");
    }

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
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
      },
    });

    // Verify ownership
    if (category && category.userId !== userId) {
      return null;
    }

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getSubCategory(id: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    // Verify ownership
    if (subCategory && subCategory.userId !== userId) {
      return null;
    }

    return subCategory;
  } catch (error) {
    console.error("Error fetching sub-category:", error);
    return null;
  }
}
