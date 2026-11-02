CREATE TABLE "GoalContribution" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "note" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GoalContribution_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Goal_userId_createdAt_idx" ON "Goal"("userId", "createdAt");
CREATE INDEX "GoalContribution_goalId_date_idx" ON "GoalContribution"("goalId", "date");
CREATE INDEX "GoalContribution_userId_date_idx" ON "GoalContribution"("userId", "date");

ALTER TABLE "GoalContribution"
ADD CONSTRAINT "GoalContribution_goalId_fkey"
FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GoalContribution"
ADD CONSTRAINT "GoalContribution_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
