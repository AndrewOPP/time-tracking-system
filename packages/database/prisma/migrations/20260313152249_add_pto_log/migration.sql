-- CreateTable
CREATE TABLE "pto_log" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hours" DECIMAL(3,1) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pto_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pto_log_user_id_date_idx" ON "pto_log"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "pto_log_user_id_date_key" ON "pto_log"("user_id", "date");

-- AddForeignKey
ALTER TABLE "pto_log" ADD CONSTRAINT "pto_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
