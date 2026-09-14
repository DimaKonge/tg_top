import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const startTag = '{/* Buy NFT Sheet */}';
const startIdx = content.indexOf(startTag);
if (startIdx > -1) {
  const endPattern = '</Sheet>';
  const endIdx = content.indexOf(endPattern, startIdx);
  if (endIdx > -1) {
    const textToRemove = content.substring(startIdx, endIdx + endPattern.length);
    const replacement = `<NftBuySheet
                  open={nftBuySheetOpen}
                  onOpenChange={setNftBuySheetOpen}
                  language={language}
                  selectedNft={selectedNftForBuy}
                  onSuccess={() => {
                    utils.tgTop.getNfts.invalidate();
                  }}
                />`;
    content = content.replace(textToRemove, replacement);
    fs.writeFileSync('client/src/pages/Home.tsx', content);
    console.log("Replaced NftBuySheet successfully");
  }
}
