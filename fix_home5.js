import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const botListingTag = '<Sheet open={botListingSheetOpen} onOpenChange={setBotListingSheetOpen}><SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100"><SheetHeader className="px-4 pb-2"><SheetTitle className="text-slate-100">{tx("Залистить бота", "List a bot")}</SheetTitle>';
const startIdx = content.indexOf(botListingTag);
if (startIdx > -1) {
  const endPattern = '</Sheet>';
  const endIdx = content.indexOf(endPattern, startIdx);
  if (endIdx > -1) {
    const textToRemove = content.substring(startIdx, endIdx + endPattern.length);
    const replacement = `<BotListingSheet
                  open={botListingSheetOpen}
                  onOpenChange={setBotListingSheetOpen}
                  language={language}
                />`;
    content = content.replace(textToRemove, replacement);
    console.log("Replaced BotListingSheet successfully");
  }
}

const botCategoryTag = '<Sheet open={botCategorySheetOpen} onOpenChange={setBotCategorySheetOpen}><SheetContent side="bottom" className="rounded-t-[26px] border-white/10 bg-[#10161f] text-slate-100"><SheetHeader className="px-4 pb-2"><SheetTitle className="text-slate-100">{tx("Рубрика ботов", "Bot category")}</SheetTitle>';
const catStartIdx = content.indexOf(botCategoryTag);
if (catStartIdx > -1) {
  const endPattern = '</Sheet>';
  const endIdx = content.indexOf(endPattern, catStartIdx);
  if (endIdx > -1) {
    const textToRemove = content.substring(catStartIdx, endIdx + endPattern.length);
    const replacement = `<BotCategorySheet
                  open={botCategorySheetOpen}
                  onOpenChange={setBotCategorySheetOpen}
                  language={language}
                  botCategory={botCategory}
                  setBotCategory={setBotCategory}
                  botTopicOptions={botTopicOptions}
                />`;
    content = content.replace(textToRemove, replacement);
    console.log("Replaced BotCategorySheet successfully");
  }
}

fs.writeFileSync('client/src/pages/Home.tsx', content);
