import { useState } from "react";
import { Gift, AtSign, Hash } from "lucide-react";
import type { Language, Nft } from "@/lib/tgTop-domain";

export type NftRankingTileVariant = "lead" | "secondary" | "compact" | "grid";

interface NftRankingTileProps {
  nft: Nft;
  rank?: number;
  variant: NftRankingTileVariant;
  language: Language;
  onClick: (nft: Nft) => void;
}

export function NftRankingTile({
  nft,
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
    ? tx("Номер +888", "+888")
    : tx("Юзернейм", "Username");

  const categoryClass = isGift
    ? "border-amber-400/35 bg-amber-500/20 text-amber-200"
    : isNumber
    ? "border-violet-400/35 bg-violet-500/20 text-violet-200"
    : "border-[#3f8cff]/35 bg-[#3f8cff]/20 text-[#a6c8ff]";

  const imageUrl = (nft as any).imageUrl || null;
  const isVideo = (nft as any).mediaKind === "video" || (imageUrl && /\.(mp4|webm|mov)$/i.test(imageUrl));

  const displayName = isUsername
    ? `@${nft.username.replace(/^@/, "")}`
    : nft.username;

  const priceDisplay = nft.price && nft.price !== "0 TON" ? nft.price : `${nft.priceAmount || 50} TON`;

  const height =
    variant === "lead"
      ? "h-[214px]"
      : variant === "secondary"
      ? "h-[142px]"
      : variant === "compact"
      ? "h-[96px]"
      : "h-[142px]";

  return (
    <button
      type="button"
      onClick={() => onClick(nft)}
      className={`group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111720] text-left transition-all hover:border-[#3f8cff]/50 hover:shadow-lg hover:shadow-[#3f8cff]/10 active:scale-[0.985] ${height}`}
    >
      {/* Background artwork or icon glow */}
      {imageUrl && !imageFailed ? (
        isVideo ? (
          <video
            src={imageUrl}
            muted
            autoPlay
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            isGift
              ? "bg-[radial-gradient(circle_at_50%_35%,#68390b_0%,#1a1005_60%,#111720_100%)]"
              : isNumber
              ? "bg-[radial-gradient(circle_at_50%_35%,#3a1d6e_0%,#15092a_60%,#111720_100%)]"
              : "bg-[radial-gradient(circle_at_50%_35%,#1c497d_0%,#0c1d33_60%,#111720_100%)]"
          }`}
        >
          {isGift ? (
            <Gift className={`text-amber-300/40 ${variant === "lead" ? "h-24 w-24" : variant === "secondary" ? "h-16 w-16" : "h-10 w-10"}`} />
          ) : isNumber ? (
            <Hash className={`text-violet-300/40 ${variant === "lead" ? "h-24 w-24" : variant === "secondary" ? "h-16 w-16" : "h-10 w-10"}`} />
          ) : (
            <AtSign className={`text-[#79afff]/40 ${variant === "lead" ? "h-24 w-24" : variant === "secondary" ? "h-16 w-16" : "h-10 w-10"}`} />
          )}
        </div>
      )}

      {/* Dark readable gradient overlay */}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,22,0.15)_0%,rgba(8,13,22,0.45)_45%,rgba(8,13,22,0.95)_100%)]" />

      {/* Top badges (Category only, no numbers) */}
      <div className={`relative z-10 flex items-center justify-end ${variant === "lead" ? "p-3.5" : variant === "secondary" ? "p-2.5" : "p-1.5"}`}>
        <span className={`rounded-md border px-1.5 py-0.5 font-semibold uppercase backdrop-blur-md ${categoryClass} ${variant === "compact" ? "text-[7px]" : "text-[8px]"}`}>
          {categoryLabel}
        </span>
      </div>

      {/* Bottom info */}
      <div className={`relative z-10 flex items-end justify-between gap-2 ${variant === "lead" ? "p-4" : variant === "secondary" ? "p-3" : "p-2"}`}>
        <div className="min-w-0 flex-1">
          <b
            className={`block truncate font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] group-hover:text-[#a6c8ff] ${
              variant === "lead" ? "text-lg" : variant === "secondary" ? "text-sm" : "text-xs"
            }`}
          >
            {displayName}
          </b>
          {variant === "lead" && (
            <small className="mt-0.5 block truncate text-[11px] text-slate-300/90">
              {tx("Владелец:", "Owner:")}{" "}
              <span className="font-medium text-white">
                {nft.ownerUsername ? `@${nft.ownerUsername}` : (nft.ownerWalletAddress ? `${nft.ownerWalletAddress.slice(0, 4)}...${nft.ownerWalletAddress.slice(-4)}` : tx("Аноним", "Anonymous"))}
              </span>
            </small>
          )}
        </div>

        <div className="shrink-0 text-right">
          {variant === "lead" ? (
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">{tx("Цена", "Price")}</span>
              <b className="font-mono text-base font-black text-[#a6c8ff] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{priceDisplay}</b>
            </div>
          ) : variant === "secondary" ? (
            <span className="inline-flex items-center rounded-md border border-[#3f8cff]/30 bg-[#0e1c31]/85 px-2 py-0.5 font-mono text-[10px] font-bold text-[#c8ddff] backdrop-blur-sm">
              {priceDisplay}
            </span>
          ) : (
            <span className="font-mono text-[9px] font-bold text-[#a6c8ff] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {priceDisplay}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default NftRankingTile;
