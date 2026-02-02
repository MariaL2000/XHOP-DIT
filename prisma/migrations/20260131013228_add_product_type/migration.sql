-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Clothes', 'Technologies', 'Food', 'Accessories');

-- DropIndex
DROP INDEX "Product_gender_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'Clothes';

-- CreateIndex
CREATE INDEX "Product_gender_type_idx" ON "Product"("gender", "type");
