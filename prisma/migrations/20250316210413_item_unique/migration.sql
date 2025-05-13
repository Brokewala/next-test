/*
  Warnings:

  - You are about to drop the column `parentId` on the `Categorie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[produitId]` on the table `ItemPanier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Categorie" DROP COLUMN "parentId";

-- CreateIndex
CREATE UNIQUE INDEX "ItemPanier_produitId_key" ON "ItemPanier"("produitId");
