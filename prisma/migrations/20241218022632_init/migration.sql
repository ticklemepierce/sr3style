-- CreateTable
CREATE TABLE "User" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "wcaId" STRING NOT NULL,
    "isComped" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sets" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "letterPair" STRING NOT NULL,
    "setType" STRING NOT NULL,
    "card" STRING NOT NULL,
    "log" STRING,

    CONSTRAINT "Sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wcaId_key" ON "User"("wcaId");

-- CreateIndex
CREATE UNIQUE INDEX "Sets_letterPair_setType_key" ON "Sets"("letterPair", "setType");
