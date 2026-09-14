import fs from 'fs';
let code = fs.readFileSync('server/db.ts', 'utf8');

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
      const { notifyRewardCredited } = await import("./telegramNotifications");
      await notifyRewardCredited({
        openId: beneficiaryOpenId,
        amountTon: amount,
        reason: input.eventType === "subscription" 
          ? "Оформление подписки"
          : input.eventType === "invite_referral"
            ? "Приглашение друга"
            : "Вступление в группу",
      });
    } catch (notifyError) {
      console.error("[awardTelegramReward] Failed to send notification:", notifyError);
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('server/db.ts', code);
