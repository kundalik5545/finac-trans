// Transaction Enums based on Prisma Schema

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT",
  TRANSFER = "TRANSFER",
}

export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum PaymentMethod {
  UPI = "UPI",
  ONLINE = "ONLINE",
  CARD = "CARD",
  BANK = "BANK",
  WALLET = "WALLET",
}

export enum BankAccountName {
  SBI = "SBI",
  AXIS = "AXIS",
  FEDERAL_BANK = "FEDERAL_BANK",
  SBI_CARD = "SBI_CARD",
  ICICI_CARD = "ICICI_CARD",
}

// Helper functions to get display names
export function getTransactionTypeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    [TransactionType.INCOME]: "Income",
    [TransactionType.EXPENSE]: "Expense",
    [TransactionType.INVESTMENT]: "Investment",
    [TransactionType.TRANSFER]: "Transfer",
  };
  return labels[type] || type;
}

export function getTransactionStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    [TransactionStatus.COMPLETED]: "Completed",
    [TransactionStatus.PENDING]: "Pending",
    [TransactionStatus.FAILED]: "Failed",
  };
  return labels[status] || status;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.UPI]: "UPI",
    [PaymentMethod.ONLINE]: "Online",
    [PaymentMethod.CARD]: "Card",
    [PaymentMethod.BANK]: "Bank Transfer",
    [PaymentMethod.WALLET]: "Wallet",
  };
  return labels[method] || method;
}

export function getBankAccountLabel(account: BankAccountName): string {
  const labels: Record<BankAccountName, string> = {
    [BankAccountName.SBI]: "SBI",
    [BankAccountName.AXIS]: "AXIS",
    [BankAccountName.FEDERAL_BANK]: "Federal Bank",
    [BankAccountName.SBI_CARD]: "SBI Card",
    [BankAccountName.ICICI_CARD]: "ICICI Card",
  };
  return labels[account] || account;
}

