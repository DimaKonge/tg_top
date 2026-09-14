import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const startTag = '<Sheet open={giveawayCreateOpen} onOpenChange={setGiveawayCreateOpen}>';
const startIdx = content.indexOf(startTag);
if (startIdx > -1) {
  const endPattern = '</Sheet>';
  const endIdx = content.indexOf(endPattern, startIdx);
  if (endIdx > -1) {
    const textToRemove = content.substring(startIdx, endIdx + endPattern.length);
    const replacement = `<GiveawayCreateSheet
              open={giveawayCreateOpen}
              onOpenChange={setGiveawayCreateOpen}
              language={language}
              mine={mine}
              onSuccess={() => utils.tgTop.getGiveaways.invalidate()}
            />`;
    content = content.replace(textToRemove, replacement);
    fs.writeFileSync('client/src/pages/Home.tsx', content);
    console.log("Replaced GiveawayCreateSheet successfully");
  }
}
