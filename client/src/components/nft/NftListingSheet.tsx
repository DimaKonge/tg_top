import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Language } from "@/lib/tgTop-domain";

export function NftListingSheet({
  open,
  onOpenChange,
  language,
  initialUsername = "",
  initialAssetClass = "offchain",
  initialItemAddress = "",
  ownerWalletAddress,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  initialUsername?: string;
  initialAssetClass?: "onchain" | "offchain";
  initialItemAddress?: string;
  ownerWalletAddress?: string;
  onSuccess?: () => void;
}) {
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  const [username, setUsername] = useState(initialUsername);
  const [assetClass, setAssetClass] = useState<"onchain" | "offchain">(initialAssetClass);
  const [itemAddress, setItemAddress] = useState(initialItemAddress);

  const [saleEnabled, setSaleEnabled] = useState(true);
  const [rentEnabled, setRentEnabled] = useState(false);
  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);

  const [priceTon, setPriceTon] = useState("50");
  const [rentPriceDay, setRentPriceDay] = useState("0.5");
  const [rentMinDays, setRentMinDays] = useState(7);
  const [rentMaxDays, setRentMaxDays] = useState(180);
  const [installmentDownPayment, setInstallmentDownPayment] = useState("15");
  const [installmentDays, setInstallmentDays] = useState(30);

  // Sync props when opening
  useEffect(() => {
    if (open) {
      setUsername(initialUsername);
      setAssetClass(initialAssetClass);
      setItemAddress(initialItemAddress);
    }
  }, [open, initialUsername, initialAssetClass, initialItemAddress]);

  const createNftMutation = trpc.tgTop.createNft.useMutation({
    onSuccess: () => {
      toast.success(tx("NFT успешно выставлен на маркетплейс!", "NFT successfully listed on the marketplace!"));
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100 max-h-[85dvh] overflow-y-auto">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle className="text-slate-100">{tx("Залистить NFT на маркет", "List NFT on Marketplace")}</SheetTitle>
          <p className="text-xs text-slate-400">
            {tx("Выберите форматы сделки: прямая продажа, аренда с сейф-кошельком или рассрочка.", "Choose deal formats: instant sale, rental with vault wallet, or installments.")}
          </p>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2">
          <div>
            <label className="text-xs font-medium text-slate-300">
              {assetClass === "onchain" ? tx("Название NFT", "NFT Name") : tx("Юзернейм (без @)", "Username (without @)")}
            </label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value.replace(/^@/, "").trim())}
              placeholder="durov"
              disabled={assetClass === "onchain"}
              className="mt-1.5 h-11 border-white/10 bg-[#17212b] px-3 text-sm text-slate-100 placeholder:text-slate-600 disabled:opacity-60"
            />
            {assetClass === "onchain" && itemAddress && (
              <div className="mt-1.5 flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5">
                <span className="text-[10px] text-slate-500">{tx("On-chain адрес:", "On-chain address:")}</span>
                <span className="font-mono text-[10px] text-slate-400">{itemAddress.slice(0, 8)}…{itemAddress.slice(-6)}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">{tx("Форматы сделки", "Deal formats")}</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSaleEnabled(!saleEnabled)}
                className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-colors ${saleEnabled ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300" : "border-white/10 bg-white/5 text-slate-400"}`}
              >
                {tx("Продажа", "Sale")}
              </button>
              <button
                type="button"
                onClick={() => setRentEnabled(!rentEnabled)}
                className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-colors ${rentEnabled ? "border-[#3f8cff]/50 bg-[#3f8cff]/15 text-[#a6c8ff]" : "border-white/10 bg-white/5 text-slate-400"}`}
              >
                {tx("Аренда", "Rent")}
              </button>
              <button
                type="button"
                onClick={() => setInstallmentsEnabled(!installmentsEnabled)}
                className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-colors ${installmentsEnabled ? "border-amber-500/50 bg-amber-500/15 text-amber-300" : "border-white/10 bg-white/5 text-slate-400"}`}
              >
                {tx("Рассрочка", "Installments")}
              </button>
            </div>
          </div>

          {saleEnabled && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <label className="text-xs font-medium text-slate-300">{tx("Цена продажи (TON)", "Sale price (TON)")}</label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={priceTon}
                onChange={e => setPriceTon(e.target.value)}
                className="mt-2 h-11 border-white/10 bg-[#17212b] px-3 text-sm text-slate-100"
              />
            </div>
          )}

          {rentEnabled && (
            <div className="rounded-2xl border border-[#3f8cff]/10 bg-[#3f8cff]/5 p-3.5">
              <label className="text-xs font-medium text-[#a6c8ff]">{tx("Аренда (TON в день)", "Rent (TON per day)")}</label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={rentPriceDay}
                onChange={e => setRentPriceDay(e.target.value)}
                className="mt-2 h-11 border-[#3f8cff]/20 bg-[#17212b] px-3 text-sm text-slate-100"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400">{tx("Мин. дней", "Min days")}</label>
                  <Input type="number" min="1" value={rentMinDays} onChange={e => setRentMinDays(parseInt(e.target.value))} className="mt-1 h-9 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{tx("Макс. дней", "Max days")}</label>
                  <Input type="number" min="1" value={rentMaxDays} onChange={e => setRentMaxDays(parseInt(e.target.value))} className="mt-1 h-9 text-xs" />
                </div>
              </div>
            </div>
          )}

          {installmentsEnabled && (
            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3.5">
              <label className="text-xs font-medium text-amber-200">{tx("Параметры рассрочки", "Installment params")}</label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400">{tx("Первый взнос (TON)", "Down payment (TON)")}</label>
                  <Input type="number" step="0.1" value={installmentDownPayment} onChange={e => setInstallmentDownPayment(e.target.value)} className="mt-1 h-9 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{tx("Срок (дней)", "Period (days)")}</label>
                  <Input type="number" min="1" value={installmentDays} onChange={e => setInstallmentDays(parseInt(e.target.value))} className="mt-1 h-9 text-xs" />
                </div>
              </div>
              <p className="mt-2 text-[9px] leading-snug text-slate-500">
                {tx("Покупатель переводит первый взнос сразу, а остаток выплачивает в течение указанного срока. NFT хранится на сейф-контракте до полной оплаты.", "Buyer transfers down payment immediately, balance is paid over the period. NFT is locked in vault until fully paid.")}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              disabled={createNftMutation.isPending || !username || (!saleEnabled && !rentEnabled && !installmentsEnabled)}
              onClick={() => {
                const modes: string[] = [];
                if (saleEnabled) modes.push("sale");
                if (rentEnabled) modes.push("rent");
                if (installmentsEnabled) modes.push("installments");

                createNftMutation.mutate({
                  username: username.trim(),
                  price: `${priceTon} TON`,
                  priceAmount: Number(priceTon) || 0,
                  rentalPricePerDay: `${rentPriceDay} TON`,
                  rentalAmountPerDay: Number(rentPriceDay) || 0,
                  minRentalDays: rentMinDays,
                  maxRentalDays: rentMaxDays,
                  listingType: modes.includes("sale") && modes.includes("rent") ? "both" : modes.includes("rent") ? "rent" : "sale",
                  assetClass: assetClass,
                  nftItemAddress: itemAddress || undefined,
                  ownerWalletAddress: ownerWalletAddress || undefined,
                  installmentsEnabled: installmentsEnabled,
                  installmentsDownPayment: Number(installmentDownPayment) || 0,
                  installmentsPeriodDays: installmentDays,
                  installmentsTotalPrice: Number(priceTon) || 0,
                  modes,
                });
              }}
              className="h-11 w-full rounded-xl bg-[#3f8cff] text-sm font-semibold text-white transition-colors hover:bg-[#3377dd] disabled:opacity-45 active:scale-[0.98]"
            >
              {createNftMutation.isPending ? tx("Публикуем…", "Publishing…") : tx("Опубликовать NFT на маркете", "Publish NFT on Marketplace")}
            </button>
            <p className="mt-2.5 text-center text-[10px] text-slate-500">
              {tx("Комиссия маркетплейса — 5% только при успешной сделке.", "Marketplace fee is 5% only on successful deals.")}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
