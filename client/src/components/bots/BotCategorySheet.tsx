import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Check } from "lucide-react";
import type { Language } from "@/lib/tgTop-domain";

export function BotCategorySheet({
  open,
  onOpenChange,
  language,
  botCategory,
  setBotCategory,
  botTopicOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  botCategory: string;
  setBotCategory: (category: string) => void;
  botTopicOptions: Array<{ id: number; code: string; label: string }>;
}) {
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100">
        <SheetHeader className="px-4 pb-2">
          <SheetTitle className="text-slate-100">{tx("Рубрика ботов", "Bot category")}</SheetTitle>
        </SheetHeader>
        <div className="max-h-[54dvh] space-y-1 overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2">
          <button 
            type="button" 
            onClick={() => { setBotCategory("Все"); onOpenChange(false); }} 
            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm ${botCategory === "Все" ? "bg-[#3f8cff]/15 text-[#d7e7f6]" : "text-slate-300 hover:bg-white/5"}`}
          >
            <span>{tx("Все рубрики", "All categories")}</span>
            {botCategory === "Все" && <Check className="h-4 w-4 text-[#8fb9ff]" />}
          </button>
          
          {botTopicOptions.map(topic => (
            <button 
              key={topic.id} 
              type="button" 
              onClick={() => { setBotCategory(topic.code); onOpenChange(false); }} 
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm ${botCategory === topic.code ? "bg-[#3f8cff]/15 text-[#d7e7f6]" : "text-slate-300 hover:bg-white/5"}`}
            >
              <span>{topic.label}</span>
              {botCategory === topic.code && <Check className="h-4 w-4 text-[#8fb9ff]" />}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
