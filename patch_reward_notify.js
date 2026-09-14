import fs from 'fs';
let code = fs.readFileSync('server/db.ts', 'utf8');

const importTarget = `export async function awardTelegramReward(input: TelegramRewardInput) {`;
const importReplacement = `import { notifyRewardCredited } from "./telegramNotifications";\n\nexport async function awardTelegramReward(input: TelegramRewardInput) {`;

code = code.replace(importTarget, importReplacement);

const target = `    // Enqueue a direct message to notify the user about the reward
    try {
      await enqueueTelegramOwnerDm({
        ownerTelegramId: String(input.beneficiaryTelegramId),
        messageType: "reward_credited",
        chatId: input.chatId,
        telegramMessageId: "reward_" + Date.now() + "_" + Math.floor(Math.random() * 1000000),
        amountUnits: amount,
        telegramEventDateMs: Date.now(),
      });
    } catch (dmError) {
      console.error("[awardTelegramReward] Failed to enqueue DM:", dmError);
    }`;

const replacement = `    // Send notification
    try {
      const reasonStr = input.eventType === "subscription" 
        ? "Оформление подписки" 
        : input.eventType === "invite_referral" 
          ? "Приглашение друга" 
          : "Вступление в группу";
      
      void notifyRewardCredited({
        openId: beneficiaryOpenId,
        amountTon: amount,
        reason: reasonStr
      });
    } catch (notifError) {
      console.error("[awardTelegramReward] Failed to send notification:", notifError);
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('server/db.ts', code);
