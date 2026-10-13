-- CreateTable
CREATE TABLE "WhiteboardData" (
    "id" SERIAL NOT NULL,
    "projectId" TEXT NOT NULL,
    "elements" JSONB,
    "appState" JSONB,
    "files" JSONB,

    CONSTRAINT "WhiteboardData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WhiteboardData" ADD CONSTRAINT "WhiteboardData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Board"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;
