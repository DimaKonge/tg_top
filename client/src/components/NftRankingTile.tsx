import { useState } from "react";
import { Sparkles, ExternalLink, ShieldCheck, Gift, AtSign, Hash, Trophy } from "lucide-react";
import type { Language, Nft } from "@/lib/tgTop-domain";

export type NftRankingTileVariant = "lead" | "secondary" | "compact" | "grid";

interface NftRankingTileProps {
  nft: Nft;
  rank: number;
  variant: NftRankingTileVariant;
  language: Language;
  onClick: (nft: Nft) => void;
}

export function NftRankingTile({
  nft,
  rank,
  variant,
  language,
  onClick,
}: NftRankingTileProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  const isGift = nft.username.toLowerCase().includes("gift") || (nft as any).category === "gifts";
  const isNumber = nft.username.startsWith("+") || (nft as any).category === "anonymous_numbers";
  const isUsername = !isGift && !isNumber;

  const categoryLabel = isGift
    ? tx("Подарок", "Gift")
    : isNumber
    ? tx("Номер +888", "Number +888")
    : tx("Юзернейм", "Username");

  const categoryClass = isGift
    ? "border-amber-400/30 bg-amber-500/15 text-amber-200"
    : isNumber
    ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
    : "border-[#3f8cff]/30 bg-[#3f8cff]/15 text-[#a6c8ff]";

  const rankBadgeStyle =
    rank === 1
      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30"
      : rank === 2
      ? "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-bold shadow-md shadow-slate-300/20"
      : rank === 3
      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md shadow-amber-700/20"
      : "bg-white/10 text-slate-300 font-semibold";

  const imageUrl = (nft as any).imageUrl || null;
  const isVideo = (nft as any).mediaKind === "video" || (imageUrl && /\.(mp4|webm|mov)$/i.test(imageUrl));

  // Determine display name
  const displayName = isUsername
    ? `@${nft.username.replace(/^@/, "")}`
    : nft.username;

  // Price or bid to display
  const priceDisplay = nft.price && nft.price !== "0 TON" ? nft.price : `${nft.priceAmount || 50} TON`;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => onClick(nft)}
        className="group relative flex h-[108px] w-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#111720] p-1.5 text-left transition-all hover:border-[#3f8cff]/45 hover:bg-[#151e2b] active:scale-[0.98]"
      >
        <div className="flex items-center justify-between gap-1">
          <span className={`inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[8px] ${rankBadgeStyle}`}>
            #{rank}
          </span>
          <span className={`truncate rounded px-1 py-0.5 text-[7px] font-semibold uppercase ${categoryClass}`}>
            {categoryLabel}
          </span>
        </div>

        <div className="relative my-auto flex h-9 w-full items-center justify-center overflow-hidden rounded-md bg-[#182230]">
          {imageUrl && !imageFailed ? (
            isVideo ? (
              <video src={imageUrl} muted autoPlay loop playsInline className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            ) : (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            )
          ) : (
            <span className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_35%_22%,#254e7a_0%,#111720_70%)] text-xs font-bold text-[#82b6ff]">
              {isGift ? <Gift className="h-4 w-4 text-amber-300" /> : isNumber ? <Hash className="h-4 w-4 text-violet-300" /> : <AtSign className="h-4 w-4 text-[#82b6ff]" />}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <b className="block truncate text-[10px] font-semibold text-slate-100 group-hover:text-[#a6c8ff]">
            {displayName}
          </b>
          <span className="block truncate text-[8px] text-slate-500 font-mono">
            {priceDisplay}
          </span>
        </div>
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        type="button"
        onClick={() => onClick(nft)}
        className="group relative flex h-[148px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111720] p-3 text-left transition-all hover:border-[#3f8cff]/50 hover:bg-[#151e2b] active:scale-[0.985]"
      >
        <div className="flex items-center justify-between gap-1.5">
          <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[9px] ${rankBadgeStyle}`}>
            #{rank}
          </span>
          <span className={`rounded-md border px-1.5 py-0.5 text-[8px] font-semibold uppercase backdrop-blur-sm ${categoryClass}`}>
            {categoryLabel}
          </span>
        </div>

        <div className="relative my-auto flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-[#182230] border border-white/5">
          {imageUrl && !imageFailed ? (
            isVideo ? (
              <video src={imageUrl} muted autoPlay loop playsInline className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            ) : (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            )
          ) : (
            <span className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_35%_22%,#254e7a_0%,#111720_70%)]">
              {isGift ? <Gift className="h-6 w-6 text-amber-300 animate-pulse" /> : isNumber ? <Hash className="h-6 w-6 text-violet-300" /> : <AtSign className="h-6 w-6 text-[#82b6ff]" />}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <b className="block truncate text-xs font-bold text-slate-100 group-hover:text-[#a6c8ff]">
            {displayName}
          </b>
          <div className="mt-0.5 flex items-center justify-between text-[9px]">
            <span className="text-slate-400 font-mono font-semibold">{priceDisplay}</span>
            <span className="text-[8px] text-[#3f8cff] font-semibold">{tx("Детали", "Details")}</span>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "lead") {
    return (
      <button
        type="button"
        onClick={() => onClick(nft)}
        className="group relative flex h-[218px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#3f8cff]/35 bg-gradient-to-b from-[#162130] to-[#0f151f] p-4 text-left shadow-lg shadow-[#3f8cff]/10 transition-all hover:border-[#3f8cff]/70 hover:shadow-[#3f8cff]/20 active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center gap-1 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 px-2 text-[10px] font-black text-slate-950 shadow-md shadow-amber-500/25">
              <Trophy className="h-3 w-3 fill-slate-950" />
              #1 ТОП ЛИДЕР
            </span>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
              {tx("Аукцион мест", "Top Auction")}
            </span>
          </div>
          <span className={`rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase backdrop-blur-sm ${categoryClass}`}>
            {categoryLabel}
          </span>
        </div>

        <div className="relative my-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#16202d]">
          {imageUrl && !imageFailed ? (
            isVideo ? (
              <video src={imageUrl} muted autoPlay loop playsInline className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            ) : (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            )
          ) : (
            <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_35%_22%,#2d6098_0%,#111720_75%)]">
              <div className="flex flex-col items-center gap-1">
                {isGift ? (
                  <Gift className="h-8 w-8 text-amber-300 animate-bounce" />
                ) : isNumber ? (
                  <Hash className="h-8 w-8 text-violet-300" />
                ) : (
                  <AtSign className="h-8 w-8 text-[#82b6ff]" />
                )}
                <span className="text-[10px] font-semibold text-slate-300">{displayName}</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f151f]/80 via-transparent to-transparent" />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <b className="block truncate text-base font-black text-white group-hover:text-[#a6c8ff]">
              {displayName}
            </b>
            <small className="mt-0.5 block truncate text-[10px] text-slate-400">
              {tx("Владелец:", "Owner:")}{" "}
              <span className="text-slate-200 font-medium">
                {nft.ownerUsername ? `@${nft.ownerUsername}` : (nft.ownerWalletAddress ? `${nft.ownerWalletAddress.slice(0, 4)}...${nft.ownerWalletAddress.slice(-4)}` : tx("Аноним", "Anonymous"))}
              </span>
            </small>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">{tx("Ставка / Цена", "Bid / Price")}</span>
            <b className="text-sm font-black text-[#a6c8ff] font-mono">{priceDisplay}</b>
          </div>
        </div>
      </button>
    );
  }

  // Regular grid cell
  return (
    <button
      type="button"
      onClick={() => onClick(nft)}
      className="group relative flex h-[136px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111720] p-3 text-left transition-all hover:border-[#3f8cff]/45 hover:bg-[#151e2b] active:scale-[0.985]"
    >
      <div className="flex items-center justify-between gap-1.5">
        <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[9px] ${rankBadgeStyle}`}>
          #{rank}
        </span>
        <span className={`rounded-md border px-1.5 py-0.5 text-[8px] font-semibold uppercase backdrop-blur-sm ${categoryClass}`}>
          {categoryLabel}
        </span>
      </div>

      <div className="relative my-auto flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-[#182230] border border-white/5">
        {imageUrl && !imageFailed ? (
          isVideo ? (
            <video src={imageUrl} muted autoPlay loop playsInline className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
          ) : (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
          )
        ) : (
          <span className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_35%_22%,#254e7a_0%,#111720_70%)]">
            {isGift ? <Gift className="h-5 w-5 text-amber-300" /> : isNumber ? <Hash className="h-5 w-5 text-violet-300" /> : <AtSign className="h-5 w-5 text-[#82b6ff]" />}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <b className="block truncate text-xs font-bold text-slate-100 group-hover:text-[#a6c8ff]">
          {displayName}
        </b>
        <div className="mt-0.5 flex items-center justify-between text-[9px]">
          <span className="text-slate-400 font-mono font-semibold">{priceDisplay}</span>
          <span className="text-[8px] text-[#3f8cff] font-semibold">{tx("Открыть", "Open")}</span>
        </div>
      </div>
    </button>
  );
}

export default NftRankingTile;
