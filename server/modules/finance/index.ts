import * as db from "../../db";

export const getAccountLedger = db.getAccountLedger;
export const getAccountActivity = db.getAccountActivity;
export const getTonDeposits = db.getTonDeposits;
export const getTonWithdrawalDefaultRecipient = db.getTonWithdrawalDefaultRecipient;
export const createTonDeposit = db.createTonDeposit;
export const markTonDepositSubmitted = db.markTonDepositSubmitted;
export const verifyTonDeposit = db.verifyTonDeposit;
export const getTonWithdrawals = db.getTonWithdrawals;
export const quoteTonWithdrawal = db.quoteTonWithdrawal;
export const createTonWithdrawal = db.createTonWithdrawal;
export const enqueueTonWithdrawalReconciliation = db.enqueueTonWithdrawalReconciliation;
export const getTonWithdrawalsForManualReview = db.getTonWithdrawalsForManualReview;
export const reviewTonWithdrawal = db.reviewTonWithdrawal;
export const enqueueTonPayoutJob = db.enqueueTonPayoutJob;
export const claimNextTonPayoutJob = db.claimNextTonPayoutJob;
export const completeTonPayoutJob = db.completeTonPayoutJob;
export const deferTonPayoutJob = db.deferTonPayoutJob;
export const sendTonPayoutJobToManualReview = db.sendTonPayoutJobToManualReview;
export const acquireTonPayoutWalletLease = db.acquireTonPayoutWalletLease;
export const releaseTonPayoutWalletLease = db.releaseTonPayoutWalletLease;
export const reconcileTonWithdrawal = db.reconcileTonWithdrawal;

export type TonWithdrawalStatus = "queued" | "manual_review" | "broadcast_pending" | "sent" | "confirmed" | "failed_refunded" | "cancelled";
export type TonPayoutJobKind = "broadcast" | "reconcile";
