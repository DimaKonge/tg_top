import fs from 'fs';
let code = fs.readFileSync('server/tonPayoutWorker.ts', 'utf8');

const target1 = `  const withdrawal = (await db.select().from(tonWithdrawals).where(eq(tonWithdrawals.id, job.withdrawalId)).limit(1))[0];
  if (!withdrawal || withdrawal.status !== "queued") {
    await completeTonPayoutJob(job.id, job.leaseToken);
    return;
  }`;

const replacement1 = `  const withdrawal = (await db.select().from(tonWithdrawals).where(eq(tonWithdrawals.id, job.withdrawalId)).limit(1))[0];
  if (!withdrawal || (withdrawal.status !== "queued" && withdrawal.status !== "broadcast_pending")) {
    await completeTonPayoutJob(job.id, job.leaseToken);
    return;
  }
  if (withdrawal.status === "broadcast_pending") {
    await enqueueTonPayoutJob(withdrawal.id, "reconcile");
    await completeTonPayoutJob(job.id, job.leaseToken);
    return;
  }`;

code = code.replace(target1, replacement1);
fs.writeFileSync('server/tonPayoutWorker.ts', code);
