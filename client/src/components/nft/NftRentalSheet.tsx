import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Language, Nft } from "@/lib/tgTop-domain";

export function NftRentalSheet({
  open,
  onOpenChange,
  language,
  selectedNft,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  selectedNft: Nft | null;
  onSuccess?: () => void;
}) {
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  const [rentalDays, setRentalDays] = useState(7);

  useEffect(() => {
    if (open && selectedNft) {
      setRentalDays(selectedNft.minRentalDays || 7);
    }
  }, [open, selectedNft]);

  const createNftRentalDealMutation = trpc.tgTop.createNftRentalDeal.useMutation({
    onSuccess: (result) => {
      toast.success(tx("Сделка инициирована! Перейдите к оплате.", "Deal initiated! Proceed to payment."));
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle className="text-slate-100">{tx("Аренда NFT через Сейф", "Rent NFT via Vault")}</SheetTitle>
        </SheetHeader>
        {selectedNft && (
          <div className="space-y-4 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-center">
              <b className="block text-xl font-bold text-slate-100">@{selectedNft.username}</b>
              <span className="mt-1 block text-sm text-slate-400">{selectedNft.rentalPricePerDay} / {tx("день", "day")}</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{tx("Срок аренды (в днях)", "Rental duration (days)")}</span>
                <b className="text-[#a6c8ff]">{rentalDays} {tx("дней", "days")}</b>
              </div>
              <input
                type="range"
                min={selectedNft.minRentalDays || 1}
                max={selectedNft.maxRentalDays || 180}
                value={rentalDays}
                onChange={(e) => setRentalDays(Number(e.target.value))}
                className="mt-3 w-full accent-[#3f8cff]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>Мин: {selectedNft.minRentalDays || 1}</span>
                <span>Макс: {selectedNft.maxRentalDays || 180}</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#3f8cff]/20 bg-[#3f8cff]/8 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#a6c8ff]">{tx("Итого к оплате", "Total to pay")}</span>
                <b className="text-sm font-bold text-slate-100">
                  {((selectedNft.rentalAmountPerDay || 0) * rentalDays).toFixed(2)} TON
                </b>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#17212b] p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#a6c8ff]">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>{tx("Безопасная аренда", "Secure rental")}</span>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-slate-400">
                {tx("Сразу после оплаты NFT блокируется в смарт-контракте сейфа. Вы сможете привязать юзернейм к своему каналу или профилю на весь срок аренды, но не сможете его продать.", "Upon payment, the NFT is locked in a vault smart contract. You can bind the username to your channel or profile for the rental period, but you cannot sell it.")}
              </p>
            </div>

            <button
              type="button"
              disabled={createNftRentalDealMutation.isPending}
              onClick={() => {
                createNftRentalDealMutation.mutate({ nftId: selectedNft.id, rentalDays });
              }}
              className="mt-2 h-12 w-full rounded-xl bg-[#3f8cff] text-sm font-semibold text-white transition-colors hover:bg-[#3377dd] active:scale-[0.98] disabled:opacity-50"
            >
              {createNftRentalDealMutation.isPending ? tx("Создание сделки…", "Creating deal…") : tx("Перейти к оплате", "Proceed to payment")}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
