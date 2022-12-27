-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceUserId" TEXT NOT NULL,
    "endUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    CONSTRAINT "Match_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "VideoChatUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "VideoChatUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
