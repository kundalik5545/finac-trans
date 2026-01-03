import { NextRequest, NextResponse } from "next/server";
import { getTransaction, updateTransaction, deleteTransaction } from "@/app/(main)/transactions/actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await getTransaction(params.id);
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error in GET /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    await updateTransaction(params.id, formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTransaction(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

