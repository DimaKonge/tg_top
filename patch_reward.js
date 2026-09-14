import fs from 'fs';
let code = fs.readFileSync('server/db.ts', 'utf8');

const target = `      if (afterSpend && !isRewardCampaignActive(afterSpend)) {
        await tx.update(groupsCatalog).set({ rewardActive: false }).where(eq(groupsCatalog.id, group.id));
      }
    });
    return { awarded: true as const, amount };
  } catch (error) {`;

const replacement = `      if (afterSpend && !isRewardCampaignActive(afterSpend)) {
        await tx.update(groupsCatalog).set({ rewardActive: false }).where(eq(groupsCatalog.id, group.id));
      }
    });
    
    // Enqueue a direct message to notify the user about the reward
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
    }
    
    return { awarded: true as const, amount };
  } catch (error) {`;

code = code.replace(target, replacement);
fs.writeFileSync('server/db.ts', code);
