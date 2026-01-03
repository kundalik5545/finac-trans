model Category {
id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

name String
type CategoryType  
 subCategories SubCategory[]
transactions Transaction[]

@@map("category")
}

model SubCategory {
id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

name String  
categoryId String
category Category @relation(fields: [categoryId], references: [id])
transactions Transaction[]

@@unique([categoryId, name])
@@index([categoryId])
@@map("sub_category")
}

// Tranasction model
model Transaction {
id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

amount Decimal @db.Decimal(65, 4)
transactionType TransactionType
status TransactionStatus @default(COMPLETED)
date DateTime
description String?  
categoryId String?
subCategoryId String?
paymentMethod PaymentMethod?

category Category? @relation(fields: [categoryId], references: [id])
subCategory SubCategory? @relation(fields: [subCategoryId], references: [id])

@@index([categoryId])
@@index([date])
@@map("transaction")
}
