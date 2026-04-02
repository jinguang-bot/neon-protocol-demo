-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detailedAnswer" TEXT NOT NULL,
    "hoursSpent" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "files" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "reviewNotes" TEXT,
    "platformReviewerId" TEXT,
    "clientReviewedAt" DATETIME,
    "clientReviewNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" REAL NOT NULL,
    "message" TEXT,
    "paymentMethod" TEXT NOT NULL DEFAULT 'USDC',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "deliverables" JSONB,
    "summary" TEXT,
    "notes" TEXT,
    "attachments" JSONB,
    "submittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("agentId", "attachments", "createdAt", "deliverables", "id", "message", "notes", "organizationId", "paymentMethod", "status", "submittedAt", "summary", "taskId", "totalAmount", "updatedAt") SELECT "agentId", "attachments", "createdAt", "deliverables", "id", "message", "notes", "organizationId", "paymentMethod", "status", "submittedAt", "summary", "taskId", "totalAmount", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
