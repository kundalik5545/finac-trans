-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 1: Add userId columns as nullable
ALTER TABLE "Category" ADD COLUMN "userId" TEXT;
ALTER TABLE "SubCategory" ADD COLUMN "userId" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "userId" TEXT;

-- Step 2: Create a default migration user (with a placeholder password hash)
-- This will be replaced when users actually register
-- Using bcrypt hash for "migration" password (you can delete this user later)
INSERT INTO "User" ("id", "email", "password", "name", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    'migration@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqYqYqYqYq', -- placeholder hash
    'Migration User',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE "email" = 'migration@example.com');

-- Step 3: Assign existing records to the migration user
DO $$
DECLARE
    migration_user_id TEXT;
BEGIN
    SELECT "id" INTO migration_user_id FROM "User" WHERE "email" = 'migration@example.com' LIMIT 1;
    
    UPDATE "Category" SET "userId" = migration_user_id WHERE "userId" IS NULL;
    UPDATE "SubCategory" SET "userId" = migration_user_id WHERE "userId" IS NULL;
    UPDATE "Transaction" SET "userId" = migration_user_id WHERE "userId" IS NULL;
END $$;

-- Step 4: Make userId required
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "SubCategory" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Transaction" ALTER COLUMN "userId" SET NOT NULL;

-- Step 5: Add foreign key constraints
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 6: Drop old unique constraint on Category.name and add new one with userId
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_name_key";
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- Step 7: Drop old unique constraint on SubCategory and add new one with userId
ALTER TABLE "SubCategory" DROP CONSTRAINT IF EXISTS "SubCategory_categoryId_name_key";
CREATE UNIQUE INDEX "SubCategory_categoryId_name_userId_key" ON "SubCategory"("categoryId", "name", "userId");

-- Step 8: Add indexes
CREATE INDEX "Category_userId_idx" ON "Category"("userId");
CREATE INDEX "SubCategory_userId_idx" ON "SubCategory"("userId");
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

