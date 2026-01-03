import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  BankAccountName,
} from "@/app/generated/prisma/client";

export type ModelType = "Transaction" | "Category" | "SubCategory";

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data: any[];
}

// Validate Transaction data
export function validateTransactions(data: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const validData: any[] = [];

  const validTypes = Object.values(TransactionType);
  const validStatuses = Object.values(TransactionStatus);
  const validPaymentMethods = Object.values(PaymentMethod);
  const validBankAccounts = Object.values(BankAccountName);

  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 because row 1 is header, index is 0-based

    // Required fields
    if (!row.amount && row.amount !== 0) {
      errors.push({
        row: rowNum,
        field: "amount",
        message: "Amount is required and must be a number",
      });
    } else if (isNaN(parseFloat(row.amount))) {
      errors.push({
        row: rowNum,
        field: "amount",
        message: "Amount must be a valid number",
      });
    }

    if (!row.date) {
      errors.push({
        row: rowNum,
        field: "date",
        message: "Date is required",
      });
    } else {
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        errors.push({
          row: rowNum,
          field: "date",
          message: "Date must be a valid date format",
        });
      }
    }

    if (!row.type) {
      errors.push({
        row: rowNum,
        field: "type",
        message: "Type is required",
      });
    } else if (!validTypes.includes(row.type as TransactionType)) {
      errors.push({
        row: rowNum,
        field: "type",
        message: `Type must be one of: ${validTypes.join(", ")}`,
      });
    }

    if (!row.status) {
      errors.push({
        row: rowNum,
        field: "status",
        message: "Status is required",
      });
    } else if (!validStatuses.includes(row.status as TransactionStatus)) {
      errors.push({
        row: rowNum,
        field: "status",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Optional but validated fields
    if (
      row.paymentMethod &&
      !validPaymentMethods.includes(row.paymentMethod as PaymentMethod)
    ) {
      errors.push({
        row: rowNum,
        field: "paymentMethod",
        message: `Payment Method must be one of: ${validPaymentMethods.join(
          ", "
        )} or empty`,
      });
    }

    if (
      row.bankAccountName &&
      !validBankAccounts.includes(row.bankAccountName as BankAccountName)
    ) {
      errors.push({
        row: rowNum,
        field: "bankAccountName",
        message: `Bank Account must be one of: ${validBankAccounts.join(
          ", "
        )} or empty`,
      });
    }

    // If no errors for this row, add to valid data
    if (!errors.some((e) => e.row === rowNum)) {
      validData.push({
        amount: parseFloat(row.amount),
        date: new Date(row.date),
        description: row.description || null,
        type: row.type,
        status: row.status,
        paymentMethod: row.paymentMethod || null,
        bankAccountName: row.bankAccountName || null,
        categoryName: row.category || null,
        subCategoryName: row.subCategory || null,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData,
  };
}

// Validate Category data
export function validateCategories(data: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNum = index + 2;

    if (!row.name || typeof row.name !== "string" || row.name.trim() === "") {
      errors.push({
        row: rowNum,
        field: "name",
        message: "Name is required and must be a non-empty string",
      });
    }

    // If no errors for this row, add to valid data
    if (!errors.some((e) => e.row === rowNum)) {
      validData.push({
        name: row.name.trim(),
        description: row.description || null,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData,
  };
}

// Validate SubCategory data
export function validateSubCategories(data: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowNum = index + 2;

    if (!row.name || typeof row.name !== "string" || row.name.trim() === "") {
      errors.push({
        row: rowNum,
        field: "name",
        message: "Name is required and must be a non-empty string",
      });
    }

    if (
      !row.category ||
      typeof row.category !== "string" ||
      row.category.trim() === ""
    ) {
      errors.push({
        row: rowNum,
        field: "category",
        message: "Category name is required and must be a non-empty string",
      });
    }

    // If no errors for this row, add to valid data
    if (!errors.some((e) => e.row === rowNum)) {
      validData.push({
        name: row.name.trim(),
        description: row.description || null,
        categoryName: row.category.trim(),
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data: validData,
  };
}

// Main validation function
export function validateExcelData(
  data: any[],
  modelType: ModelType
): ValidationResult {
  switch (modelType) {
    case "Transaction":
      return validateTransactions(data);
    case "Category":
      return validateCategories(data);
    case "SubCategory":
      return validateSubCategories(data);
    default:
      return {
        isValid: false,
        errors: [{ row: 0, field: "modelType", message: "Invalid model type" }],
        data: [],
      };
  }
}
