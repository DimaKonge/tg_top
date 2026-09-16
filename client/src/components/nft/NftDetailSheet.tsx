import { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Gift,
  AtSign,
  Hash,
  Trophy,
  Copy,
  Check,
  Send,
  Sparkles,
  Lock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import type { Language, Nft } from "@/lib/tgTop-domain";

interface NftDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nft: Nft | null;
  rank?: number;
  language: Language;
  onBuy?: (nft: Nft) => void;
  onBid?: (nft: Nft) => void;
  onRent?: (nft: Nft) => void;
  onInstallments?: (nft: Nft) => void;
}

export function NftDetailSheet({
  open,
  onOpenChange,
  nft,
  rank = 1,
  language,
  onBuy,
  onBid,
  onRent,
  onInstallments,
}: NftDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  if (!nft) return null;

  const isGift = nft.username.toLowerCase().includes("gift") || (nft as any).category === "gifts";
  const isNumber = nft.username.startsWith("+") || (nft as any).category === "anonymous_numbers";
  const isUsername = !isGift && !isNumber;

  const categoryLabel = isGift
    ? tx("Telegram Подарок (Gift)", "Telegram Gift")
    : isNumber
    ? tx("Анонимный номер (+888)", "Anonymous Number (+888)")
    : tx("Telegram Юзернейм (Fragment)", "Fragment Username");

  const displayName = isUsername ? `@${nft.username.replace(/^@/, "")}` : nft.username;
  const imageUrl = (nft as any).imageUrl || null;
  const isVideo = (nft as any).mediaKind === "video" || (imageUrl && /\.(mp4|webm|mov)$/i.test(imageUrl));

  const copyAddress = (address: string) => {
    void navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success(tx("Адрес скопирован в буфер", "Address copied to clipboard"));
    setTimeout(() => setCopied(false), 2000);
  };

  const getFragmentUrl = () => {
    if (isUsername) {
      return `https://fragment.com/username/${encodeURIComponent(nft.username.replace(/^@/, ""))}`;
    }
    if (isNumber) {
      return `https://fragment.com/number/${encodeURIComponent(nft.username.replace(/[^0-9]/g, ""))}`;
    }
    return `https://getgems.io`;
  };

  const getOwnerTelegramUrl = () => {
    if (nft.ownerUsername && nft.ownerUsername !== "Anonymous") {
      return `https://t.me/${encodeURIComponent(nft.ownerUsername.replace(/^@/, ""))}`;
    }
    return null;
  };

  const priceDisplay = nft.price && nft.price !== "0 TON" ? nft.price : `${nft.priceAmount || 50} TON`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-[28px] border-white/10 bg-[#0e141d] p-0 text-slate-100 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#0e141d]/90 px-5 py-4 backdrop-blur-md">
          <SheetHeader className="text-left">
            <SheetTitle className="text-base font-bold text-slate-100">{displayName}</SheetTitle>
          </SheetHeader>
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-slate-300">
            {categoryLabel}
          </span>
        </div>

        <div className="space-y-4 px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4">
          {/* Main Visual Presentation */}
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#182332] to-[#101722] shadow-inner">
            {imageUrl ? (
              isVideo ? (
                <video src={imageUrl} muted autoPlay loop playsInline className="h-full w-full object-contain" />
              ) : (
                <img src={imageUrl} alt={displayName} className="h-full w-full object-contain p-2" />
              )
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[radial-gradient(circle_at_35%_22%,#254e7a_0%,#111720_70%)] shadow-lg shadow-[#3f8cff]/20">
                  {isGift ? (
                    <Gift className="h-10 w-10 text-amber-300 animate-bounce" />
                  ) : isNumber ? (
                    <Hash className="h-10 w-10 text-violet-300" />
                  ) : (
                    <AtSign className="h-10 w-10 text-[#82b6ff]" />
                  )}
                </div>
                <b className="text-base font-bold text-slate-100">{displayName}</b>
                <span className="text-xs text-slate-400">{categoryLabel}</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur-md">
              {categoryLabel}
            </div>
          </div>

          {/* Auction & Price Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#3f8cff]/25 bg-gradient-to-br from-[#3f8cff]/10 to-transparent p-3.5">
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#a6c8ff]">
                <TrendingUp className="h-3 w-3" />
                {tx("Ставка в аукционе", "Auction Bid")}
              </span>
              <b className="mt-1 block text-base font-black text-white font-mono">{priceDisplay}</b>
              <small className="text-[9px] text-slate-400">
                {tx("Позиция в рейтинге: ", "Ranking position: ")}#{rank}
              </small>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
              <span className="text-[10px] font-medium text-slate-400">{tx("Статус лота", "Asset Status")}</span>
              <b className="mt-1 block text-sm font-bold text-emerald-300">
                {nft.status === "available" ? tx("Доступен к сделке", "Available") : tx("В сделке", "In deal")}
              </b>
              <small className="text-[9px] text-slate-400">
                {nft.listingType === "both" ? tx("Продажа + аренда", "Sale + rent") : nft.listingType === "rent" ? tx("Аренда", "Rent") : tx("Продажа", "Sale")}
              </small>
            </div>
          </div>

          {/* Asset details / Address */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-300">{tx("Параметры и адреса", "Asset Specifications")}</h4>

            {nft.nftItemAddress && (
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
                <div>
                  <span className="block text-[9px] text-slate-400">{tx("Адрес NFT (On-chain):", "NFT Contract Address:")}</span>
                  <span className="font-mono text-[11px] text-slate-200">
                    {nft.nftItemAddress.slice(0, 10)}…{nft.nftItemAddress.slice(-8)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyAddress(nft.nftItemAddress!)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs">
              <div>
                <span className="block text-[9px] text-slate-400">{tx("Владелец:", "Owner:")}</span>
                <span className="font-semibold text-slate-200">
                  {nft.ownerUsername ? `@${nft.ownerUsername.replace(/^@/, "")}` : tx("Анонимный владелец", "Anonymous Owner")}
                </span>
              </div>
              {getOwnerTelegramUrl() && (
                <a
                  href={getOwnerTelegramUrl()!}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#3f8cff]/15 px-2.5 py-1 text-[10px] font-semibold text-[#a6c8ff] hover:bg-[#3f8cff]/25"
                >
                  <Send className="h-3 w-3" />
                  {tx("Написать", "Message")}
                </a>
              )}
            </div>

            {/* Smart contract vault */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{tx("Безопасная сделка через верифицированный Сейф TG TOP", "Secure deal protected by TG TOP Verified Vault")}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {nft.status === "available" && (
              <div className="grid grid-cols-2 gap-2">
                {onBuy && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      onBuy(nft);
                    }}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {tx("Купить лот", "Buy Asset")}
                  </button>
                )}

                {onBid && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      onBid(nft);
                    }}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#3f8cff] font-semibold text-white shadow-lg shadow-[#3f8cff]/25 transition-all hover:bg-[#3377dd] active:scale-[0.98]"
                  >
                    <TrendingUp className="h-4 w-4" />
                    {tx("Ставка в ТОП", "Bid for Top")}
                  </button>
                )}
              </div>
            )}

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={getFragmentUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                {isGift ? "Getgems" : "Fragment"}
              </a>

              {getOwnerTelegramUrl() ? (
                <a
                  href={getOwnerTelegramUrl()!}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                  {tx("Владелец в TG", "Owner in TG")}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs font-medium text-slate-600"
                >
                  {tx("Владелец скрыт", "Owner hidden")}
                </button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NftDetailSheet;
