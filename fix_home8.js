import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// 1. Add botCategory state back
const stateInsertIdx = content.indexOf('const [botCategorySheetOpen, setBotCategorySheetOpen] = useState(false);');
if (stateInsertIdx > -1) {
    content = content.slice(0, stateInsertIdx) + 'const [botCategory, setBotCategory] = useState("Все");\n  ' + content.slice(stateInsertIdx);
}

// 2. Fix the openGiveawayCreate function to not use deleted states
const openGiveawayCreateFnStart = content.indexOf('const openGiveawayCreate = (group: Group) => {');
if (openGiveawayCreateFnStart > -1) {
    const endFn = content.indexOf('};', openGiveawayCreateFnStart);
    const replacement = `const openGiveawayCreate = (group: Group) => {
    setPage("giveaways");
    window.setTimeout(() => setGiveawayCreateOpen(true), 0);
  };`;
    content = content.slice(0, openGiveawayCreateFnStart) + replacement + content.slice(endFn + 2);
}

// 3. Remove inline bot listing (since it's now in BotListingSheet)
const inlineBotListingStart = content.indexOf('<article className="rounded-2xl border border-[#3f8cff]/20 bg-[#3f8cff]/[0.055] p-3.5">');
if (inlineBotListingStart > -1) {
    const inlineBotListingEnd = content.indexOf('</article>', inlineBotListingStart);
    if (inlineBotListingEnd > -1) {
        content = content.slice(0, inlineBotListingStart) + content.slice(inlineBotListingEnd + 10);
    }
}

fs.writeFileSync('client/src/pages/Home.tsx', content);
