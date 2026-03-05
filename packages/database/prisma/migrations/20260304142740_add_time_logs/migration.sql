-- CreateTable
CREATE TABLE "time_log" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hours" DECIMAL(3,1) NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "time_log_user_id_date_idx" ON "time_log"("user_id", "date");

-- CreateIndex
CREATE INDEX "time_log_project_id_date_idx" ON "time_log"("project_id", "date");

-- AddForeignKey
ALTER TABLE "time_log" ADD CONSTRAINT "time_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_log" ADD CONSTRAINT "time_log_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
