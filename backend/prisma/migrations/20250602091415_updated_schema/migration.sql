/*
  Warnings:

  - Added the required column `dateResponded` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "dateResponded" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
