import * as db from "../../db";

export const getAuctionSlots = db.getAuctionSlots;
export const placeBid = db.placeBid;
export const payRankingBidWithGramCredit = db.payRankingBidWithGramCredit;
export const createStarsRankingPaymentIntent = db.createStarsRankingPaymentIntent;
export const setStarsRankingInvoiceMessage = db.setStarsRankingInvoiceMessage;
export const approveStarsRankingPayment = db.approveStarsRankingPayment;
export const settleStarsRankingPayment = db.settleStarsRankingPayment;

export type { RankingLotOptions, RankingCreditDebit } from "../../db";
