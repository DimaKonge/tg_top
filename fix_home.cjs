const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const startTag = '{false && <Sheet open={nftListingSheetOpen} onOpenChange={setNftListingSheetOpen}>';
const startIdx = content.indexOf(startTag);
if (startIdx > -1) {
  let openTags = 0;
  let endIdx = startIdx;
  
  // We just need to find the matching closing tag.
  // Actually, since it's exactly 1 Sheet, we can just find the NEXT `</Sheet>` after the button that says "Комиссия маркетплейса"
  const endMarker = '{tx("Комиссия маркетплейса — 5% только при успешной сделке.", "Marketplace fee is 5% only on successful deals.")}\n                            </p>\n                          </div>\n                        </div>\n                      </SheetContent>\n                    </Sheet>}';
  
  // wait, the sed command added `{false && <Sheet`, so we need to add `}` after `</Sheet>`. 
  // Let's just do a regex replace or manual string slice.
  
  const endPattern = 'Комиссия маркетплейса — 5% только при успешной сделке.", "Marketplace fee is 5% only on successful deals.")}\n                            </p>\n                          </div>\n                        </div>\n                      </SheetContent>\n                    </Sheet>';
  const endPatternIdx = content.indexOf(endPattern, startIdx);
  if (endPatternIdx > -1) {
     const textToRemove = content.substring(startIdx, endPatternIdx + endPattern.length);
     content = content.replace(textToRemove, '');
  } else {
     console.log("Could not find end pattern");
  }
}
fs.writeFileSync('client/src/pages/Home.tsx', content);
