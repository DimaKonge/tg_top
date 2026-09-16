import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("TG TOP Telegram user avatar sync", () => {
  it("prioritizes the current Mini App photo_url over a cached session avatar", () => {
    const userAvatarSource = readFileSync(new URL("../components/UserAvatar.tsx", import.meta.url), "utf8");
    const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

    expect(userAvatarSource).toContain("telegramAvatar");
    expect(userAvatarSource).toContain("user?.avatarUrl");
    expect(userAvatarSource).toContain("useUserAvatarInfo");
    expect(userAvatarSource).toContain("UserAvatar");
    expect(userAvatarSource).toContain("handleImageError");
    expect(userAvatarSource).toContain("AVATAR_CACHE_KEY_PREFIX");
    expect(homeSource).toContain("UserAvatar");
  });
});
