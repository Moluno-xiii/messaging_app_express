/*
  Warnings:

  - You are about to drop the column `id` on the `friend` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "friend" DROP CONSTRAINT "friend_id_fkey";

-- DropIndex
DROP INDEX "friend_id_key";

-- AlterTable
ALTER TABLE "friend" DROP COLUMN "id",
ALTER COLUMN "status" SET DEFAULT 'OFFLINE';

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_email_fkey" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
