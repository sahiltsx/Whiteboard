-- DropForeignKey
ALTER TABLE "WhiteboardData" DROP CONSTRAINT "WhiteboardData_projectId_fkey";

-- AlterTable
ALTER TABLE "WhiteboardData" ALTER COLUMN "elements" SET DEFAULT '[]',
ALTER COLUMN "appState" SET DEFAULT '{}',
ALTER COLUMN "files" SET DEFAULT '{}',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "WhiteboardData" ADD CONSTRAINT "WhiteboardData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Board"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;
