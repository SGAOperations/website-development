-- CreateTable: Page (if not exists)
CREATE TABLE IF NOT EXISTS "Page" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "finalDraftId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Draft (if not exists)
CREATE TABLE IF NOT EXISTS "Draft" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Page path (unique, if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS "Page_path_key" ON "Page"("path");

-- CreateIndex: Page finalDraftId (unique, if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS "Page_finalDraftId_key" ON "Page"("finalDraftId");

-- CreateIndex: Draft pageId (if not exists)
CREATE INDEX IF NOT EXISTS "Draft_pageId_idx" ON "Draft"("pageId");

-- AddForeignKey: Draft to Page (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Draft_pageId_fkey'
    ) THEN
        ALTER TABLE "Draft" ADD CONSTRAINT "Draft_pageId_fkey" 
        FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: Page finalDraft to Draft (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Page_finalDraftId_fkey'
    ) THEN
        ALTER TABLE "Page" ADD CONSTRAINT "Page_finalDraftId_fkey" 
        FOREIGN KEY ("finalDraftId") REFERENCES "Draft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

