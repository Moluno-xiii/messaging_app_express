/*
  Warnings:

  - You are about to drop the column `messge` on the `Message` table. All the data in the column will be lost.
  - Added the required column `mesasge` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "messge",
ADD COLUMN     "mesasge" TEXT NOT NULL;
