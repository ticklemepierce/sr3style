/*
  Warnings:

  - The `log` column on the `Sets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `card` on the `Sets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Sets" DROP COLUMN "card";
ALTER TABLE "Sets" ADD COLUMN     "card" JSONB NOT NULL;
ALTER TABLE "Sets" DROP COLUMN "log";
ALTER TABLE "Sets" ADD COLUMN     "log" JSONB;
