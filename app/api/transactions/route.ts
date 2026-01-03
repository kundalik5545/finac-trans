import { NextRequest, NextResponse } from "next/server";
import { getTransactions, getAllTransactions, createTransaction } from "@/app/(main)/transactions/actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const exportData = searchParams.get("export") === "true";

    if (exportData) {
      const transactions = await getAllTransactions();
      return NextResponse.json({ transactions });
    }

    const result = await getTransactions(page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    await createTransaction(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/transactions:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

