import { describe, expect, it } from "vitest";
import * as moderationService from "./index";

describe("Moderation Module", () => {
  it("exports required moderation functions and policies", () => {
    expect(typeof moderationService.getModerationAccess).toBe("function");
    expect(typeof moderationService.getModerationQueue).toBe("function");
    expect(typeof moderationService.getActiveModerationListings).toBe("function");
    expect(typeof moderationService.moderateGroup).toBe("function");
    expect(typeof moderationService.flagGroupForModeration).toBe("function");
    expect(typeof moderationService.getModerators).toBe("function");
    expect(typeof moderationService.setModeratorRole).toBe("function");
    expect(typeof moderationService.getModeratedGroupLifecycle).toBe("function");
  });

  it("handles lifecycle transitions correctly via policy", () => {
    const approveListed = moderationService.getModeratedGroupLifecycle("listed", "approve");
    expect(approveListed).toEqual({
      status: "listed",
      moderationStatus: "approved",
      keepsListedAt: true,
    });

    const approvePending = moderationService.getModeratedGroupLifecycle("pending", "approve");
    expect(approvePending).toEqual({
      status: "pending",
      moderationStatus: "approved",
      keepsListedAt: false,
    });

    const block = moderationService.getModeratedGroupLifecycle("listed", "block");
    expect(block).toEqual({
      status: "blocked",
      moderationStatus: "blocked",
      keepsListedAt: false,
    });

    const review = moderationService.getModeratedGroupLifecycle("listed", "review");
    expect(review).toEqual({
      status: "review",
      moderationStatus: "review",
      keepsListedAt: false,
    });
  });
});
