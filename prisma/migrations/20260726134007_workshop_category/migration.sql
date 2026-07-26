-- CreateEnum
CREATE TYPE "WorkshopCategory" AS ENUM ('WARSZTAT', 'KURS_CERTYFIKOWANY', 'EVENT');

-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "category" "WorkshopCategory" NOT NULL DEFAULT 'WARSZTAT';
