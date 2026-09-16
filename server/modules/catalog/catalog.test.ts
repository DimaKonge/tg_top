import { describe, expect, it } from "vitest";
import * as catalogService from "./index";

describe("catalog module interface", () => {
  it("exports essential catalog query functions", () => {
    expect(typeof catalogService.getGroupsCatalog).toBe("function");
    expect(typeof catalogService.getMyGroups).toBe("function");
    expect(typeof catalogService.getGroupDetail).toBe("function");
    expect(typeof catalogService.getGroupById).toBe("function");
    expect(typeof catalogService.getGroupByChatId).toBe("function");
  });

  it("exports catalog taxonomy functions", () => {
    expect(typeof catalogService.getCatalogTaxonomy).toBe("function");
    expect(typeof catalogService.addCatalogCountry).toBe("function");
    expect(typeof catalogService.deleteCatalogCountry).toBe("function");
    expect(typeof catalogService.addCatalogCity).toBe("function");
    expect(typeof catalogService.deleteCatalogCity).toBe("function");
    expect(typeof catalogService.addCatalogTopic).toBe("function");
    expect(typeof catalogService.deleteCatalogTopic).toBe("function");
  });

  it("exports bot catalog procedures", () => {
    expect(typeof catalogService.getApprovedBotListings).toBe("function");
    expect(typeof catalogService.getMyBotListings).toBe("function");
    expect(typeof catalogService.submitBotListing).toBe("function");
    expect(typeof catalogService.moderateBotListing).toBe("function");
  });

  it("exports search and membership tracking functions", () => {
    expect(typeof catalogService.getPublicSearchGroupByUsername).toBe("function");
    expect(typeof catalogService.getSearchIndexableGroups).toBe("function");
    expect(typeof catalogService.recordGroupSnapshot).toBe("function");
    expect(typeof catalogService.recordGroupActivity).toBe("function");
    expect(typeof catalogService.recordGroupMembership).toBe("function");
  });
});
