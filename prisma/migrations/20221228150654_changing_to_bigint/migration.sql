/*
  Warnings:

  - You are about to alter the column `endsOn` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceUserId" TEXT NOT NULL,
    "endsOn" BIGINT NOT NULL DEFAULT 0,
    "endUserId" TEXT NOT NULL,
    "sourceUserJoined" BOOLEAN NOT NULL DEFAULT false,
    "endUserJoined" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'chatting',
    "sourceUserFeedback" TEXT,
    "endUserFeedback" TEXT,
    CONSTRAINT "Match_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "VideoChatUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "VideoChatUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("endUserFeedback", "endUserId", "endUserJoined", "endsOn", "id", "sourceUserFeedback", "sourceUserId", "sourceUserJoined", "status") SELECT "endUserFeedback", "endUserId", "endUserJoined", "endsOn", "id", "sourceUserFeedback", "sourceUserId", "sourceUserJoined", "status" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
