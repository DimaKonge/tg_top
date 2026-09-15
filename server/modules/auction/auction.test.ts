import { describe, it, expect } from "vitest";
import * as auctionModule from "./index";

describe("Auction Module", () => {
  it("exports required auction and ranking functions", () => {
    expect(typeof auctionModule.getAuctionSlots).toBe("function");
    expect(typeof auctionModule.placeBid).toBe("function");
    expect(typeof auctionModule.payRankingBidWithGramCredit).toBe("function");
    expect(typeof auctionModule.createStarsRankingPaymentIntent).toBe("function");
    expect(typeof auctionModule.setStarsRankingInvoiceMessage).toBe("function");
    expect(typeof auctionModule.approveStarsRankingPayment).toBe("function");
    expect(typeof auctionModule.settleStarsRankingPayment).toBe("function");
  });
});
