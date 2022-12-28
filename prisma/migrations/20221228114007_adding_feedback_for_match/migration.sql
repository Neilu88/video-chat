-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceUserId" TEXT NOT NULL,
    "endUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'chatting',
    "sourceUserFeedback" TEXT,
    "endUserFeedback" TEXT,
    CONSTRAINT "Match_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "VideoChatUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "VideoChatUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("endUserId", "id", "sourceUserId", "status") SELECT "endUserId", "id", "sourceUserId", "status" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
