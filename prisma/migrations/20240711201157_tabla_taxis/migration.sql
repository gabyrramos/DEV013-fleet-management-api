/*
  Warnings:

  - You are about to drop the `Taxi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Taxi";

-- CreateTable
CREATE TABLE "taxis" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,

    CONSTRAINT "taxis_pkey" PRIMARY KEY ("id")
);
