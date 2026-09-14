import type { Language, Nft } from "@/lib/tgTop-domain";

export function NftCard({
  nft,
  language,
  onRent,
  onBuy,
  onInstallments,
}: {
  nft: Nft;
  language: Language;
  onRent?: (nft: Nft) => void;
  onBuy?: (nft: Nft) => void;
  onInstallments?: (nft: Nft) => void;
}) {
  const copy = language === "en"
    ? {
        sale: "Sale",
        rent: "Rent",
        both: "Sale + rent",
        available: "Available",
        rented: "Rented",
        sold: "Sold",
        owner: "Owner",
        perDay: "GRAM / day",
        days: "days",
        onchain: "On-chain",
        offchain: "Off-chain",
        installments: "Installments",
        downPayment: "Down payment",
        buy: "Buy",
        requestRental: "Request rental",
        vaultProtected: "Vault protected (non-transferable)",
      }
    : {
        sale: "Продажа",
        rent: "Аренда",
        both: "Продажа + аренда",
        available: "Доступен",
        rented: "В аренде",
        sold: "Продан",
        owner: "Владелец",
        perDay: "GRAM / день",
        days: "дней",
        onchain: "On-chain",
        offchain: "Off-chain",
        installments: "Рассрочка",
        downPayment: "Первый взнос",
        buy: "Купить",
        requestRental: "Запросить аренду",
        vaultProtected: "Сейф-хранилище (без передачи)",
      };
  const listingLabel = nft.listingType === "sale" ? copy.sale : nft.listingType === "rent" ? copy.rent : copy.both;
  const statusLabel = nft.status === "available" ? copy.available : nft.status === "rented" ? copy.rented : copy.sold;

  return (
    <article className="rounded-2xl border border-white/8 bg-[#111720] p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <b className="block truncate text-base font-semibold text-slate-100">@{nft.username}</b>
            <small className="mt-1 block text-xs text-slate-500">{copy.owner}: {nft.ownerUsername}</small>
          </span>
          <span className="flex flex-col items-end gap-1">
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">{nft.assetClass === "onchain" ? copy.onchain : copy.offchain}</span>
            <span className="rounded-md border border-[#3f8cff]/25 bg-[#3f8cff]/10 px-2 py-1 text-[10px] font-medium text-[#a6c8ff]">{statusLabel}</span>
          </span>
        </div>

        {/* Vault lock badge for rentals and installments */}
        {(nft.listingType === "rent" || nft.listingType === "both" || nft.installmentsAvailable) && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">{copy.vaultProtected}</span>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {(nft.listingType === "sale" || nft.listingType === "both") && (
            <div className="rounded-xl bg-white/5 p-2.5">
              <span className="block text-[10px] text-slate-500">{copy.sale}</span>
              <b className="mt-1 block text-sm text-slate-100">{nft.price}</b>
            </div>
          )}
          {(nft.listingType === "rent" || nft.listingType === "both") && (
            <div className="rounded-xl bg-white/5 p-2.5">
              <span className="block text-[10px] text-slate-500">{copy.rent}</span>
              <b className="mt-1 block text-sm text-slate-100">{nft.rentalPricePerDay} {copy.perDay}</b>
              <small className="mt-1 block text-[10px] text-slate-500">{nft.minRentalDays}–{nft.maxRentalDays} {copy.days}</small>
            </div>
          )}
          {nft.installmentsAvailable && (
            <div className="col-span-2 rounded-xl border border-amber-500/20 bg-amber-500/8 p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-amber-400">{copy.installments}</span>
                <span className="text-[10px] text-amber-300">{nft.installmentsPeriodDays ?? 30} {copy.days}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[11px] text-slate-300">{copy.downPayment}:</span>
                <b className="text-xs text-amber-200">{nft.installmentsDownPayment ?? "—"} TON</b>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
        <span className="inline-flex rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400">{listingLabel}</span>
        <div className="flex items-center gap-1.5">
          {(nft.listingType === "sale" || nft.listingType === "both") && nft.status === "available" && onBuy && (
            <button
              type="button"
              onClick={() => onBuy(nft)}
              className="rounded-lg border border-emerald-500/35 bg-emerald-500/12 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20 active:scale-[0.98]"
            >
              {copy.buy}
            </button>
          )}
          {(nft.listingType === "rent" || nft.listingType === "both") && nft.status === "available" && onRent && (
            <button
              type="button"
              onClick={() => onRent(nft)}
              className="rounded-lg border border-[#3f8cff]/35 bg-[#3f8cff]/10 px-2.5 py-1.5 text-[10px] font-semibold text-[#a6c8ff] transition-colors hover:bg-[#3f8cff]/18 active:scale-[0.98]"
            >
              {copy.requestRental}
            </button>
          )}
          {nft.installmentsAvailable && nft.status === "available" && onInstallments && (
            <button
              type="button"
              onClick={() => onInstallments(nft)}
              className="rounded-lg border border-amber-500/35 bg-amber-500/12 px-2.5 py-1.5 text-[10px] font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 active:scale-[0.98]"
            >
              {copy.installments}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

