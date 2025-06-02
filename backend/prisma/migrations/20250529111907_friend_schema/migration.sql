-- CreateEnum
CREATE TYPE "status" AS ENUM ('ONLINE', 'OFFLINE');

-- DropIndex
DROP INDEX "message_id_key";

-- CreateTable
CREATE TABLE "friend" (
    "id" TEXT NOT NULL,
    "status" "status" NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "friend_id_key" ON "friend"("id");

-- CreateIndex
CREATE UNIQUE INDEX "friend_email_key" ON "friend"("email");

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
