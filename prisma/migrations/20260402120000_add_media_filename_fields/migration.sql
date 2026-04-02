ALTER TABLE "Media"
ADD COLUMN "fileStem" TEXT,
ADD COLUMN "fileExtension" TEXT;

UPDATE "Media"
SET
  "fileStem" = CASE
    WHEN regexp_replace("name", '\.[^.]+$', '') <> '' THEN regexp_replace("name", '\.[^.]+$', '')
    WHEN regexp_replace(regexp_replace("storagePath", '^.*/', ''), '\.[^.\/]+$', '') <> '' THEN regexp_replace(regexp_replace("storagePath", '^.*/', ''), '\.[^.\/]+$', '')
    ELSE 'file'
  END,
  "fileExtension" = lower(
    COALESCE(
      NULLIF(substring("storagePath" from '\.([^.\/]+)$'), ''),
      NULLIF(substring("name" from '\.([^.]+)$'), ''),
      ''
    )
  );

ALTER TABLE "Media"
ALTER COLUMN "fileStem" SET NOT NULL,
ALTER COLUMN "fileExtension" SET NOT NULL;
