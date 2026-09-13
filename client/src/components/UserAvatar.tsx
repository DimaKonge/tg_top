import React, { useState, useEffect, useMemo } from "react";

export interface UserAvatarProps {
  size?: "sm" | "md";
  className?: string;
  user?: {
    openId?: string | null;
    avatarUrl?: string | null;
    name?: string | null;
    telegramUsername?: string | null;
  } | null;
  defaultName?: string;
  telegramUser?: {
    id?: number | string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  } | null;
}

const AVATAR_CACHE_KEY_PREFIX = "tgtop_avatar_cache_";

export function useUserAvatarInfo(
  user?: UserAvatarProps["user"],
  telegramUser?: UserAvatarProps["telegramUser"],
  defaultName: string = "Пользователь"
) {
  // Resolve telegram user details
  const currentTelegramUser =
    telegramUser !== undefined
      ? telegramUser
      : typeof window !== "undefined"
      ? window.Telegram?.WebApp?.initDataUnsafe?.user
      : undefined;

  const telegramAvatar = currentTelegramUser?.photo_url || null;
  const userTelegramUsername = (
    currentTelegramUser?.username ||
    user?.telegramUsername ||
    ""
  )
    .replace(/^@/, "")
    .trim() || null;

  const telegramUserId = currentTelegramUser?.id
    ? String(currentTelegramUser.id)
    : user?.openId?.startsWith("telegram:")
    ? user.openId.replace("telegram:", "")
    : null;

  const telegramFullName = currentTelegramUser
    ? [currentTelegramUser.first_name, currentTelegramUser.last_name]
        .filter(Boolean)
        .join(" ")
        .trim()
    : "";

  const displayName =
    telegramFullName ||
    user?.name ||
    userTelegramUsername ||
    defaultName;

  const userInitial = (
    displayName.replace(/^@/, "").trim().slice(0, 1) ||
    userTelegramUsername?.slice(0, 1) ||
    "T"
  ).toUpperCase();

  // Cache lookup for instant zero-delay render
  const cacheKey = telegramUserId
    ? `${AVATAR_CACHE_KEY_PREFIX}${telegramUserId}`
    : userTelegramUsername
    ? `${AVATAR_CACHE_KEY_PREFIX}${userTelegramUsername}`
    : null;

  const cachedUrl = useMemo(() => {
    if (typeof window === "undefined" || !cacheKey) return null;
    try {
      return localStorage.getItem(cacheKey);
    } catch {
      return null;
    }
  }, [cacheKey]);

  // Candidates ordered by reliability & speed
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (cachedUrl) {
      list.push(cachedUrl);
    }
    if (telegramAvatar && telegramAvatar !== cachedUrl) {
      list.push(telegramAvatar);
    }
    if (user?.avatarUrl && user.avatarUrl !== cachedUrl && user.avatarUrl !== telegramAvatar) {
      list.push(user.avatarUrl);
    }

    if (telegramUserId) {
      const proxyUrl = `/api/telegram-user-avatar/${telegramUserId}`;
      if (!list.includes(proxyUrl)) {
        list.push(proxyUrl);
      }
    }
    return list;
  }, [cachedUrl, telegramAvatar, user?.avatarUrl, userTelegramUsername, telegramUserId]);

  return {
    displayName,
    userTelegramUsername,
    userInitial,
    candidates,
    cacheKey,
  };
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = "sm",
  className = "",
  user,
  telegramUser,
  defaultName = "Пользователь",
}) => {
  const { userInitial, candidates, cacheKey } = useUserAvatarInfo(user, telegramUser, defaultName);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setImageLoaded(false);
  }, [candidates]);

  const currentUrl = candidates[candidateIndex] || null;

  const isSm = size === "sm";
  const sizeClasses = isSm ? "h-9 w-9 text-xs" : "h-12 w-12 text-base";

  const handleImageError = () => {
    // If the cached URL failed, purge it from localStorage
    if (cacheKey && currentUrl && typeof window !== "undefined") {
      try {
        if (localStorage.getItem(cacheKey) === currentUrl) {
          localStorage.removeItem(cacheKey);
        }
      } catch {
        // ignore
      }
    }
    setCandidateIndex((prev) => prev + 1);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Persist verified working URL to localStorage for instant subsequent loads
    if (cacheKey && currentUrl && typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, currentUrl);
      } catch {
        // ignore
      }
    }
  };

  return (
    <span
      className={`relative grid ${sizeClasses} shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-[#1b2430] font-bold text-white shadow-sm ring-1 ring-white/10 ${className}`}
    >
      {/* Background fallback gradient with initial letter is always rendered underneath to prevent dark empty gaps */}
      <span className="absolute inset-0 grid h-full w-full place-items-center bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#0f172a] text-white font-bold drop-shadow-sm select-none">
        {userInitial}
      </span>

      {/* Image overlays once available */}
      {currentUrl && (
        <img
          key={currentUrl}
          src={currentUrl}
          alt=""
          referrerPolicy="no-referrer"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </span>
  );
};
