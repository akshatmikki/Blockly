-- Add FirstName and LastName columns to Users table
ALTER TABLE "Identity"."Users"
ADD COLUMN "FirstName" VARCHAR(100),
ADD COLUMN "LastName" VARCHAR(100);

-- Add PlainPassword column (Note: Storing plain passwords is NOT recommended for security)
-- This is added only per your request, but should be encrypted in production
ALTER TABLE "Identity"."Users"
ADD COLUMN "PlainPassword" TEXT;

-- Create index on DeletedAt for better query performance
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON "Identity"."Users"("DeletedAt");

-- Create index on IsActive for better query performance
CREATE INDEX IF NOT EXISTS idx_users_is_active ON "Identity"."Users"("IsActive");
