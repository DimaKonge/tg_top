import { describe, expect, it } from "vitest";
import * as telegramService from "./index";

describe("Telegram Module", () => {
  it("exports notification and bot messaging primitives", () => {
    expect(typeof telegramService.notifyCommunityListed).toBe("function");
    expect(typeof telegramService.notifyCommunityRemovedFromTop).toBe("function");
    expect(typeof telegramService.notifyRecordedRankingBid).toBe("function");
    expect(typeof telegramService.createStarsRankingInvoiceLink).toBe("function");
    expect(typeof telegramService.resolveVerifiedGroupEntryLink).toBe("function");
    expect(typeof telegramService.getTelegramUserAvatarUrl).toBe("function");
    expect(typeof telegramService.deliverOperationsLog).toBe("function");
    expect(typeof telegramService.formatTopActivityLog).toBe("function");
  });

  it("formats top activity log properly", () => {
    const log = telegramService.formatTopActivityLog({
      event: "listed_in_top",
      groupTitle: "Crypto News",
      groupId: 42,
      actor: { name: "Test User", username: "testuser" },
    });
    expect(typeof log).toBe("string");
    expect(log).toContain("Crypto News");
    expect(log).toContain("#42");
    expect(log).toContain("Test User");
  });
});
