import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShieldCheck, Info } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Language, Nft } from "@/lib/tgTop-domain";

export function NftBuySheet({
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

  const createNftBuyDealMutation = trpc.tgTop.createNftBuyDeal.useMutation({
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
          <SheetTitle className="text-slate-100">{tx("Покупка NFT-юзернейма", "Buy NFT Username")}</SheetTitle>
        </SheetHeader>
        {selectedNft && (
          <div className="space-y-4 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-center">
              <b className="block text-xl font-bold text-slate-100">@{selectedNft.username}</b>
              <span className="mt-1 block text-sm text-slate-400">{tx("Владелец", "Owner")}: {selectedNft.ownerUsername}</span>
              <div className="mt-3 inline-block rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <span className="block text-xs text-slate-400">{tx("Стоимость покупки", "Purchase price")}</span>
                <b className="text-lg font-bold text-emerald-300">{selectedNft.price}</b>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#17212b] p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#a6c8ff]">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>{tx("Защита эскроу-сделкой", "Escrow protected deal")}</span>
              </div>
              <ul className="mt-2 space-y-1.5 pl-6 text-[11px] text-slate-400 list-disc">
                <li>{tx("Средства замораживаются на сейф-кошельке", "Funds are locked in a vault wallet")}</li>
                <li>{tx("Продавец получает уведомление о переводе NFT", "Seller is notified to transfer the NFT")}</li>
                <li>{tx("Мы отслеживаем блокчейн, и при успешной передаче продавец получает выплату", "We monitor the blockchain, and upon successful transfer, the seller receives payment")}</li>
              </ul>
            </div>

            {selectedNft.assetClass === "onchain" && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>{tx("On-chain сделка", "On-chain deal")}</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-200/80">
                  {tx("Продавец должен перевести NFT на ваш кошелёк. Убедитесь, что у вас привязан кошелёк в профиле.", "The seller must transfer the NFT to your wallet. Make sure you have a wallet linked in your profile.")}
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={createNftBuyDealMutation.isPending}
              onClick={() => {
                createNftBuyDealMutation.mutate({ nftId: selectedNft.id });
              }}
              className="mt-2 h-12 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
            >
              {createNftBuyDealMutation.isPending ? tx("Создание сделки…", "Creating deal…") : tx("Перейти к оплате", "Proceed to payment")}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
