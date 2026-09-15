import { useState, useMemo } from "react";
import { TgTopAnimatedPyramidAvatar } from "@/components/TgTopAnimatedPyramidAvatar";

export type CommunityArtworkGroup = {
  chatId: string;
  title: string;
  username: string | null;
  avatarFileId: string | null;
  animatedAvatarUrl?: string | null;
};

export const getTelegramAvatarSrc = (group: CommunityArtworkGroup) => group.chatId ? `/api/telegram-avatar/${group.chatId}` : null;

export function useGroupAvatarInfo(group?: CommunityArtworkGroup | null) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const candidates = useMemo(() => {
    const list: string[] = [];
    if (!group) return list;
    const baseSrc = getTelegramAvatarSrc(group);
    if (baseSrc) {
      list.push(baseSrc);
    }
    if (group.avatarFileId && group.chatId) {
      list.push(`/api/telegram-avatar/${group.chatId}?v=${group.avatarFileId}`);
    }
    if (group.username) {
      list.push(`https://t.me/i/userpic/320/${encodeURIComponent(group.username.replace(/^@/, "").trim())}.jpg`);
    }
    return list;
  }, [group?.chatId, group?.username, group?.avatarFileId]);

  return { candidates, candidateIndex, setCandidateIndex, imageLoaded, setImageLoaded };
}

export function CommunityAvatar({
  group,
  large = false,
  hero = false,
  compact = false,
  allowAnimatedMedia = false,
}: {
  group: CommunityArtworkGroup;
  large?: boolean;
  hero?: boolean;
  compact?: boolean;
  allowAnimatedMedia?: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const { candidates, candidateIndex, setCandidateIndex, imageLoaded, setImageLoaded } = useGroupAvatarInfo(group);
  const avatarSrc = candidates[candidateIndex] || null;
  return (
    <span className={`${""} grid shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#1b2430] text-sm font-semibold text-slate-200`}>
      {allowAnimatedMedia && group.animatedAvatarUrl && !videoFailed ? (
        <video key={group.animatedAvatarUrl} src={group.animatedAvatarUrl} poster={avatarSrc ?? undefined} muted loop autoPlay playsInline preload="metadata" disablePictureInPicture className="h-full w-full object-cover" onLoadedData={event => { void event.currentTarget.play().catch(() => undefined); }} onError={() => setVideoFailed(true)} />
      ) : avatarSrc && !false ? (
        <img src={avatarSrc} alt="" onError={() => setCandidateIndex(prev => prev + 1)} onLoad={() => setImageLoaded(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`} />
      ) : (
        <TgTopAnimatedPyramidAvatar className="h-[62%] w-[62%]" title="TG TOP" />
      )}
    </span>
  );
}

export function FullBleedCommunityArtwork({ group, allowAnimatedMedia = false }: { group: CommunityArtworkGroup; allowAnimatedMedia?: boolean }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const { candidates, candidateIndex, setCandidateIndex, imageLoaded, setImageLoaded } = useGroupAvatarInfo(group);
  const avatarSrc = candidates[candidateIndex] || null;
  return (
    <span className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#253a58_0%,#111720_68%)]">
      {allowAnimatedMedia && group.animatedAvatarUrl && !videoFailed ? (
        <video key={group.animatedAvatarUrl} src={group.animatedAvatarUrl} poster={avatarSrc ?? undefined} muted loop autoPlay playsInline preload="metadata" disablePictureInPicture className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-transform duration-300 group-hover:scale-105 [-webkit-touch-callout:none]" onLoadedData={event => { void event.currentTarget.play().catch(() => undefined); }} onError={() => setVideoFailed(true)} />
      ) : avatarSrc && !false ? (
        <img src={avatarSrc} alt="" draggable={false} onError={() => setCandidateIndex(prev => prev + 1)} onLoad={() => setImageLoaded(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${imageLoaded ? "opacity-100" : "opacity-0"}`} />
      ) : (
        <span className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_35%_22%,#254e7a_0%,#111720_70%)] p-[24%]"><TgTopAnimatedPyramidAvatar className="h-full w-full" title="TG TOP" /></span>
      )}
    </span>
  );
}
