import * as db from "../../db";

// Groups & Channels Catalog
export const getGroupsCatalog = db.getGroupsCatalog;
export const getMyGroups = db.getMyGroups;
export const getGroupDetail = db.getGroupDetail;
export const getGroupById = db.getGroupById;
export const getGroupByChatId = db.getGroupByChatId;
export const saveMyGroupsLayout = db.saveMyGroupsLayout;
export const updateGroupAnimatedAvatarSnapshot = db.updateGroupAnimatedAvatarSnapshot;
export const setGroupManager = db.setGroupManager;
export const upsertTelegramGroup = db.upsertTelegramGroup;
export const listGroupsWithCredits = db.listGroupsWithCredits;
export const listGroupWithCredits = db.listGroupWithCredits;
export const deleteGroups = db.deleteGroups;
export const unlistGroups = db.unlistGroups;

// Taxonomy & Directory Admin
export const getCatalogTaxonomy = db.getCatalogTaxonomy;
export const addCatalogCountry = db.addCatalogCountry;
export const deleteCatalogCountry = db.deleteCatalogCountry;
export const addCatalogCity = db.addCatalogCity;
export const deleteCatalogCity = db.deleteCatalogCity;
export const addCatalogTopic = db.addCatalogTopic;
export const deleteCatalogTopic = db.deleteCatalogTopic;

// Bots Catalog
export const getApprovedBotListings = db.getApprovedBotListings;
export const getMyBotListings = db.getMyBotListings;
export const submitBotListing = db.submitBotListing;
export const moderateBotListing = db.moderateBotListing;
export const getBotModerationQueue = db.getBotModerationQueue;
export const getAllBotListings = db.getAllBotListings;
export const deleteBotListing = db.deleteBotListing;

// Search & Indexing
export const getPublicSearchGroupByUsername = db.getPublicSearchGroupByUsername;
export const getSearchIndexableGroups = db.getSearchIndexableGroups;
export const recordGroupSnapshot = db.recordGroupSnapshot;
export const recordGroupActivity = db.recordGroupActivity;
export const recordGroupMembership = db.recordGroupMembership;

export type { GroupListingOptions } from "../../db";
