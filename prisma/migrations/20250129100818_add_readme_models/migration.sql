/*
  Warnings:

  - You are about to drop the column `userId` on the `ReadmeVersion` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReadmeVersion_readmeId_version_key";

-- AlterTable
ALTER TABLE "ReadmeVersion" DROP COLUMN "userId";

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Readme_projectId_idx" ON "Readme"("projectId");

-- CreateIndex
CREATE INDEX "ReadmeVersion_readmeId_idx" ON "ReadmeVersion"("readmeId");

-- CreateIndex
CREATE INDEX "ReadmeVersion_version_idx" ON "ReadmeVersion"("version");
