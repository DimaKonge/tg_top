import fs from 'fs';
let code = fs.readFileSync('server/db.ts', 'utf8');

const target = `    // Send notification
    try {
      const reasonStr = input.eventType === "subscription" 
        ? "Оформление подписки" 
        : input.eventType === "invite_referral" 
          ? "Приглашение друга" 
          : "Вступление в группу";
      
      void notifyRewardCredited({
        telegramUserId: input.beneficiaryTelegramId,
        groupTitle: group.title,
        amount: amount,
        reason: reasonStr
      });
    } catch (notifError) {
      console.error("[awardTelegramReward] Failed to send notification:", notifError);
    }
    
    return { awarded: true as const, amount };
  } catch (error) {`;

const replacement = `    // Send notification
    try {
      const reasonStr = input.eventType === "subscription" 
        ? "Оформление подписки" 
        : input.eventType === "invite_referral" 
          ? "Приглашение друга" 
          : "Вступление в группу";
      
      void notifyRewardCredited({
        telegramUserId: input.beneficiaryTelegramId,
        groupTitle: group.title,
        amount: amount,
        reason: reasonStr
      });
    } catch (notifError) {
      console.error("[awardTelegramReward] Failed to send notification:", notifError);
    }
    
    return { awarded: true as const, amount };
  } catch (error) {
    if (isDuplicateTelegramEventError(error)) {
      return { awarded: false as const, reason: "already_awarded" as const };
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('server/db.ts', code);
