/*
  Warnings:

  - A unique constraint covering the columns `[user_id,project_id,date]` on the table `time_log` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "time_log_user_id_project_id_date_key" ON "time_log"("user_id", "project_id", "date");
