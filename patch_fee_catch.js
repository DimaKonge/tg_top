import fs from 'fs';
let code = fs.readFileSync('server/tonPayoutWorker.ts', 'utf8');

const target2 = `      if (finalNetNano !== initialNetNano) {
        prepared = await buildTonPayoutExternalBoc({ destinationWalletAddress: withdrawal.destinationWalletAddress, amountNano: finalNetNano, reference: withdrawal.reference });
      }
    } catch {
      await cancelQueuedWithdrawalForFeeFailure(withdrawal.id, withdrawal.userOpenId, grossAmountNano);
      await completeTonPayoutJob(job.id, job.leaseToken);
      return;
    }`;

const replacement2 = `      if (finalNetNano !== initialNetNano) {
        prepared = await buildTonPayoutExternalBoc({ destinationWalletAddress: withdrawal.destinationWalletAddress, amountNano: finalNetNano, reference: withdrawal.reference });
      }
    } catch (error) {
      if (error instanceof Error && error.message === "fee_exceeds_amount") {
        await cancelQueuedWithdrawalForFeeFailure(withdrawal.id, withdrawal.userOpenId, grossAmountNano);
        await completeTonPayoutJob(job.id, job.leaseToken);
        return;
      }
      throw error;
    }`;

code = code.replace(target2, replacement2);
fs.writeFileSync('server/tonPayoutWorker.ts', code);
