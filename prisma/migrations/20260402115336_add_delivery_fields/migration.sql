-- AlterTable
ALTER TABLE "Order" ADD COLUMN "attachments" JSONB;
ALTER TABLE "Order" ADD COLUMN "deliverables" JSONB;
ALTER TABLE "Order" ADD COLUMN "notes" TEXT;
ALTER TABLE "Order" ADD COLUMN "submittedAt" DATETIME;
ALTER TABLE "Order" ADD COLUMN "summary" TEXT;
