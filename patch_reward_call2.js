import fs from 'fs';
let code = fs.readFileSync('server/db.ts', 'utf8');

const target = `    // Send notification
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

const replacement = `    // Send notification
    try {
      const { notifyRewardCredited } = await import("./telegramNotifications");
      await notifyRewardCredited({
        telegramUserId: input.beneficiaryTelegramId,
        amount,
        groupTitle: group.title,
      });
    } catch (notifyError) {
      console.error("[awardTelegramReward] Failed to send notification:", notifyError);
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('server/db.ts', code);
