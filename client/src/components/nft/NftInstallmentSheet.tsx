import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Language, Nft } from "@/lib/tgTop-domain";

export function NftInstallmentSheet({
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

  const [installmentDays, setInstallmentDays] = useState(30);
  const [installmentDownPayment, setInstallmentDownPayment] = useState("15");

  useEffect(() => {
    if (open && selectedNft) {
      setInstallmentDays(selectedNft.installmentsPeriodDays || 30);
      setInstallmentDownPayment((selectedNft.installmentsDownPayment || 15).toString());
    }
  }, [open, selectedNft]);

  const createNftInstallmentDealMutation = trpc.tgTop.createNftInstallmentDeal.useMutation({
    onSuccess: (result) => {
      toast.success(tx("Сделка инициирована! Перейдите к оплате первого взноса.", "Deal initiated! Proceed to down payment."));
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle className="text-slate-100">{tx("Покупка в рассрочку через Сейф", "Installment purchase via Vault")}</SheetTitle>
        </SheetHeader>
        {selectedNft && (
          <div className="space-y-4 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-center">
              <b className="block text-xl font-bold text-slate-100">@{selectedNft.username}</b>
              <div className="mt-2 flex items-center justify-center gap-4 text-xs">
                <span className="text-slate-400">{tx("Полная стоимость:", "Total price:")} <b className="text-slate-200">{selectedNft.price}</b></span>
                <span className="text-slate-400">{tx("Срок:", "Term:")} <b className="text-amber-300">{installmentDays} {tx("дней", "days")}</b></span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Lock className="h-4 w-4 shrink-0" />
                <span>{tx("Удержание в сейфе до полной выплаты", "Held in vault until fully paid")}</span>
              </div>
              <ul className="mt-2 space-y-1.5 pl-6 text-[11px] text-slate-400 list-disc">
                <li>{tx("Вы платите только первый взнос сейчас", "You only pay the down payment now")}</li>
                <li>{tx("NFT переводится с кошелька продавца в сейф", "NFT is transferred from the seller's wallet to the vault")}</li>
                <li>{tx("Остаток можно вносить частями в любое время", "Balance can be paid in installments at any time")}</li>
                <li>{tx("При полной оплате NFT автоматически перейдёт к вам", "Upon full payment, the NFT will automatically transfer to you")}</li>
              </ul>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#17212b] p-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">{tx("К оплате сейчас (первый взнос)", "To pay now (down payment)")}</span>
              <b className="text-base font-bold text-slate-100">{installmentDownPayment} TON</b>
            </div>

            <button
              type="button"
              disabled={createNftInstallmentDealMutation.isPending}
              onClick={() => {
                createNftInstallmentDealMutation.mutate({ nftId: selectedNft.id });
              }}
              className="mt-2 h-12 w-full rounded-xl bg-amber-500 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50"
            >
              {createNftInstallmentDealMutation.isPending ? tx("Создание сделки…", "Creating deal…") : tx("Перейти к оплате первого взноса", "Proceed to down payment")}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
