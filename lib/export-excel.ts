import * as XLSX from "xlsx";

export interface TransactionExport {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  description: string | null;
  paymentMethod: string | null;
  bankAccountName: string | null;
  category: string | null;
  subCategory: string | null;
}

export function exportToExcel(transactions: TransactionExport[], filename: string = "transactions") {
  // Prepare data for Excel
  const data = transactions.map((transaction) => ({
    Date: transaction.date,
    Amount: transaction.amount,
    Type: transaction.type,
    Status: transaction.status,
    Description: transaction.description || "",
    "Payment Method": transaction.paymentMethod || "",
    "Bank Account": transaction.bankAccountName || "",
    Category: transaction.category || "",
    "Sub Category": transaction.subCategory || "",
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Date
    { wch: 12 }, // Amount
    { wch: 12 }, // Type
    { wch: 12 }, // Status
    { wch: 30 }, // Description
    { wch: 15 }, // Payment Method
    { wch: 15 }, // Bank Account
    { wch: 15 }, // Category
    { wch: 15 }, // Sub Category
  ];
  worksheet["!cols"] = columnWidths;

  // Generate Excel file and download
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
}

