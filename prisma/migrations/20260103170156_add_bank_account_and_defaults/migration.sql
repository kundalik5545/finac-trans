-- CreateEnum
CREATE TYPE "BankAccountName" AS ENUM ('SBI', 'AXIS', 'FEDERAL_BANK', 'SBI_CARD', 'ICICI_CARD');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bankAccountName" "BankAccountName" DEFAULT 'SBI_CARD',
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'EXPENSE',
ALTER COLUMN "paymentMethod" SET DEFAULT 'UPI';
