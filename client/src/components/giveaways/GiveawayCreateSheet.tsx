import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Language, Group } from "@/lib/tgTop-domain";

export function GiveawayCreateSheet({
  open,
  onOpenChange,
  language,
  mine,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  mine: Group[];
  onSuccess?: () => void;
}) {
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  const [giveawayGroupId, setGiveawayGroupId] = useState("");
  const [giveawayTitle, setGiveawayTitle] = useState("");
  const [giveawayPrizeTitle, setGiveawayPrizeTitle] = useState("");
  const [giveawayRules, setGiveawayRules] = useState("");
  const [giveawayBoostOnly, setGiveawayBoostOnly] = useState(false);
  const [giveawayEndsAt, setGiveawayEndsAt] = useState(new Date(Date.now() + 24 * 3600_000).toISOString().slice(0, 16));

  const createGiveaway = trpc.tgTop.createGiveaway.useMutation({
    onSuccess: () => {
      toast.success(tx("Розыгрыш опубликован!", "Giveaway published!"));
      onOpenChange(false);
      setGiveawayGroupId("");
      setGiveawayTitle("");
      setGiveawayPrizeTitle("");
      setGiveawayRules("");
      setGiveawayBoostOnly(false);
      onSuccess?.();
    },
    onError: error => toast.error(error.message),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto rounded-t-[22px] border-white/10 bg-[#10161f] text-slate-100">
        <SheetHeader className="px-4">
          <SheetTitle className="text-slate-100">{tx("Создать розыгрыш", "Create Giveaway")}</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 px-4 pb-5">
          <Select value={giveawayGroupId} onValueChange={setGiveawayGroupId}>
            <SelectTrigger className="h-11 border-white/10 bg-[#0b0f14] text-slate-200">
              <SelectValue placeholder={tx("Выберите свою группу", "Select your group")} />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#111720] text-slate-100">
              {mine.map(group => <SelectItem key={group.id} value={String(group.id)}>{group.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input 
            value={giveawayTitle} 
            maxLength={160} 
            onChange={event => setGiveawayTitle(event.target.value)} 
            placeholder={tx("Название розыгрыша", "Giveaway title")} 
            className="h-11 border-white/10 bg-[#0b0f14]" 
          />
          <Input 
            value={giveawayPrizeTitle} 
            maxLength={160} 
            onChange={event => setGiveawayPrizeTitle(event.target.value)} 
            placeholder={tx("Приз", "Prize")} 
            className="h-11 border-white/10 bg-[#0b0f14]" 
          />
          <Textarea 
            value={giveawayRules} 
            maxLength={2000} 
            onChange={event => setGiveawayRules(event.target.value)} 
            placeholder={tx("Правила участия (необязательно)", "Rules (optional)")} 
            className="min-h-20 border-white/10 bg-[#0b0f14]" 
          />
          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0b0f14] px-3 py-3">
            <input 
              type="checkbox" 
              checked={giveawayBoostOnly} 
              onChange={event => setGiveawayBoostOnly(event.target.checked)} 
              className="mt-0.5 h-4 w-4 accent-[#3f8cff]" 
            />
            <span>
              <b className="block text-xs text-slate-200">{tx("Только для бустеров", "Boosters only")}</b>
              <small className="mt-1 block text-[11px] leading-4 text-slate-500">
                {tx("Перед вступлением бот проверит, что пользователь бустит выбранное сообщество.", "The bot will verify if the user boosts the community before joining.")}
              </small>
            </span>
          </label>
          <Input 
            value={giveawayEndsAt} 
            type="datetime-local" 
            min={new Date(Date.now() + 5 * 60_000).toISOString().slice(0, 16)} 
            onChange={event => setGiveawayEndsAt(event.target.value)} 
            className="h-11 border-white/10 bg-[#0b0f14]" 
          />
          <button 
            type="button" 
            onClick={() => { 
              const groupId = Number(giveawayGroupId); 
              const endsAt = new Date(giveawayEndsAt); 
              if (!groupId || giveawayTitle.trim().length < 3 || giveawayPrizeTitle.trim().length < 2 || Number.isNaN(endsAt.getTime())) { 
                toast.error(tx("Заполните группу, название, приз и время окончания", "Fill in group, title, prize and end time")); 
                return; 
              } 
              createGiveaway.mutate({ 
                groupId, 
                title: giveawayTitle, 
                prizeTitle: giveawayPrizeTitle, 
                rules: giveawayRules || undefined, 
                boostOnly: giveawayBoostOnly, 
                endsAt 
              }); 
            }} 
            disabled={createGiveaway.isPending} 
            className="w-full rounded-xl bg-[#1688f5] px-4 py-3 text-sm font-semibold text-white disabled:opacity-45"
          >
            {createGiveaway.isPending ? tx("Публикуем…", "Publishing…") : tx("Опубликовать розыгрыш", "Publish giveaway")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
