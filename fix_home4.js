import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const startTag = '{/* Installment NFT Sheet */}';
const startIdx = content.indexOf(startTag);
if (startIdx > -1) {
  const endPattern = '</Sheet>';
  const endIdx = content.indexOf(endPattern, startIdx);
  if (endIdx > -1) {
    const textToRemove = content.substring(startIdx, endIdx + endPattern.length);
    const replacement = `<NftInstallmentSheet
                  open={nftInstallmentSheetOpen}
                  onOpenChange={setNftInstallmentSheetOpen}
                  language={language}
                  selectedNft={selectedNftForInstallment}
                  onSuccess={() => {
                    utils.tgTop.getNfts.invalidate();
                  }}
                />`;
    content = content.replace(textToRemove, replacement);
    fs.writeFileSync('client/src/pages/Home.tsx', content);
    console.log("Replaced NftInstallmentSheet successfully");
  }
}
