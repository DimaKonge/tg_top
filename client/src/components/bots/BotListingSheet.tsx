import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Language } from "@/lib/tgTop-domain";

export function BotListingSheet({
  open,
  onOpenChange,
  language,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
}) {
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);
  const [botTelegramLinkDraft, setBotTelegramLinkDraft] = useState("");

  const submitBotListing = trpc.tgTop.submitBotListing.useMutation({
    onSuccess: () => {
      toast.success(tx("Заявка отправлена на модерацию", "Application submitted for moderation"));
      onOpenChange(false);
      setBotTelegramLinkDraft("");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle className="text-slate-100">{tx("Залистить бота", "List a bot")}</SheetTitle>
          <p className="text-xs leading-5 text-slate-500">
            {tx("Вставьте публичную ссылку. Бот появится в каталоге только после ручной проверки модератором.", "Paste a public link. The bot appears only after manual moderation.")}
          </p>
        </SheetHeader>
        <div className="space-y-3 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3">
          <Input 
            autoFocus 
            value={botTelegramLinkDraft} 
            onChange={event => setBotTelegramLinkDraft(event.target.value)} 
            placeholder="https://t.me/username" 
            className="h-11 border-white/10 bg-[#17212b] px-3 text-sm text-slate-100 placeholder:text-slate-600" 
          />
          <button 
            type="button" 
            onClick={() => submitBotListing.mutate({ telegramLink: botTelegramLinkDraft })} 
            disabled={botTelegramLinkDraft.trim().length < 3 || submitBotListing.isPending} 
            className="h-11 w-full rounded-xl bg-[#3f8cff] text-sm font-semibold text-white disabled:opacity-45"
          >
            {submitBotListing.isPending ? tx("Отправляем…", "Sending…") : tx("Отправить на проверку", "Submit for review")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
