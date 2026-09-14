import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Remove createGiveaway mutation since it's now inside the component
const createGiveawayStart = 'const createGiveaway = trpc.tgTop.createGiveaway.useMutation(';
const createGiveawayStartIdx = content.indexOf(createGiveawayStart);
if (createGiveawayStartIdx > -1) {
    const createGiveawayEnd = '  });';
    const createGiveawayEndIdx = content.indexOf(createGiveawayEnd, createGiveawayStartIdx);
    if (createGiveawayEndIdx > -1) {
        const toRemove = content.substring(createGiveawayStartIdx, createGiveawayEndIdx + createGiveawayEnd.length + 1); // +1 for newline
        content = content.replace(toRemove, '');
        console.log("Removed createGiveaway mutation from Home");
    }
}

// Remove submitBotListing mutation
const submitBotListingStart = 'const submitBotListing = trpc.tgTop.submitBotListing.useMutation(';
const submitBotListingStartIdx = content.indexOf(submitBotListingStart);
if (submitBotListingStartIdx > -1) {
    const submitBotListingEnd = '  });';
    const submitBotListingEndIdx = content.indexOf(submitBotListingEnd, submitBotListingStartIdx);
    if (submitBotListingEndIdx > -1) {
        const toRemove = content.substring(submitBotListingStartIdx, submitBotListingEndIdx + submitBotListingEnd.length + 1);
        content = content.replace(toRemove, '');
        console.log("Removed submitBotListing mutation from Home");
    }
}

fs.writeFileSync('client/src/pages/Home.tsx', content);
