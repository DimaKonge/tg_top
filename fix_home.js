import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');
const startTag = '{false && <Sheet open={nftListingSheetOpen} onOpenChange={setNftListingSheetOpen}>';
const startIdx = content.indexOf(startTag);
if (startIdx > -1) {
  const endPattern = '</Sheet>';
  // Find the exact `</Sheet>` corresponding to this sheet. It is right before `{/* Buy NFT Sheet */}`.
  const buySheetPattern = '{/* Buy NFT Sheet */}';
  const buySheetIdx = content.indexOf(buySheetPattern, startIdx);
  if (buySheetIdx > -1) {
    const endIdx = content.lastIndexOf(endPattern, buySheetIdx) + endPattern.length;
    const textToRemove = content.substring(startIdx, endIdx);
    content = content.replace(textToRemove, '');
    fs.writeFileSync('client/src/pages/Home.tsx', content);
    console.log("Removed old sheet successfully");
  }
}
