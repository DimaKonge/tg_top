import fs from 'fs';
let code = fs.readFileSync('/tmp/tgtop2/server/telegramBot.ts', 'utf8');

code = code.replace(
  'await notifyRewardCredited({ telegramUserId: result.beneficiaryTelegramId, groupTitle: result.groupTitle, amount: result.amount });',
  'await notifyRewardCredited({ telegramUserId: result.beneficiaryTelegramId, groupTitle: result.groupTitle, amount: result.amount, reason: "подписка на канал" });'
);

code = code.replace(
  'await notifyRewardCredited({ telegramUserId: result.beneficiaryTelegramId, groupTitle: result.groupTitle, amount: result.amount });',
  'await notifyRewardCredited({ telegramUserId: result.beneficiaryTelegramId, groupTitle: result.groupTitle, amount: result.amount, reason: "вступление в группу" });'
);

fs.writeFileSync('/tmp/tgtop2/server/telegramBot.ts', code);
