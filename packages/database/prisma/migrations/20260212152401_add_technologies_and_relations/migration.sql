-- CreateEnum
CREATE TYPE "TechnologyType" AS ENUM ('BACKEND', 'FRONTEND', 'GENERAL', 'DESIGN', 'AI');

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TechnologyType" NOT NULL,
    "image" TEXT,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_technology" (
    "user_id" TEXT NOT NULL,
    "technology_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_technology_pkey" PRIMARY KEY ("user_id","technology_id")
);

-- CreateTable
CREATE TABLE "_ProjectToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE INDEX "_ProjectToTechnology_B_index" ON "_ProjectToTechnology"("B");

-- AddForeignKey
ALTER TABLE "user_technology" ADD CONSTRAINT "user_technology_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_technology" ADD CONSTRAINT "user_technology_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "Technology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
