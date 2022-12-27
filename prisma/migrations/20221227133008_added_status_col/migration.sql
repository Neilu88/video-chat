-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoChatUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting'
);
INSERT INTO "new_VideoChatUser" ("contact", "id", "name") SELECT "contact", "id", "name" FROM "VideoChatUser";
DROP TABLE "VideoChatUser";
ALTER TABLE "new_VideoChatUser" RENAME TO "VideoChatUser";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
