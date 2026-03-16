/*
  Warnings:

  - You are about to drop the column `phone` on the `customers` table. All the data in the column will be lost.
  - Made the column `gst_number` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "email" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "phone",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "phone_country_code" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ALTER COLUMN "gst_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Service';
