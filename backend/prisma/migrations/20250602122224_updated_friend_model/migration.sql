/*
  Warnings:

  - You are about to drop the column `friendId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Friend` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail,friendEmail]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friendEmail` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_userId_fkey";

-- DropIndex
DROP INDEX "Friend_userId_friendId_key";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "friendId",
DROP COLUMN "userId",
ADD COLUMN     "friendEmail" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_userEmail_friendEmail_key" ON "Friend"("userEmail", "friendEmail");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendEmail_fkey" FOREIGN KEY ("friendEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
