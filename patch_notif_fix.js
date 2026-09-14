import fs from 'fs';
let code = fs.readFileSync('server/telegramNotifications.ts', 'utf8');

// Replace both our duplicate additions back to the original text
const textToReplace1 = `export async function notifyRewardCredited(input: { openId: string; amountTon: number; reason: string }) {
  const chatId = getTelegramChatIdFromOpenId(input.openId);
  if (!chatId || !botToken) return false;
  
  const text = [
    "🎉 Начислен бонус!",
    "",
    "Сумма: +" + input.amountTon + " gRam",
    "Причина: " + input.reason,
    "",
    "Бонус зачислен на ваш баланс. Откройте TG TOP, чтобы просмотреть статистику.",
  ].join("\\n");
  try {
    const response = await axios.post<{ ok: boolean }>(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      chat_id: chatId,
      text,
      reply_markup: { inline_keyboard: [[{ text: "Открыть TG TOP", web_app: { url: miniAppUrl } }]] },
    }, { timeout: 15_000 });
    return response.data.ok;
  } catch (error) {
    console.warn("[Telegram] Could not send reward notification:", error);
    return false;
  }
}`;

const textToReplace2 = `export async function notifyRewardCredited(input: { openId: string; amountTon: number; reason: string }) {
  const chatId = getTelegramChatIdFromOpenId(input.openId);
  if (!chatId || !botToken) return false;
  
  const text = [
    "🎉 Начислен бонус!",
    "",
    "Сумма: +" + input.amountTon + " gRam",
    "Основание: " + input.reason,
    "",
    "Бонус зачислен на ваш баланс. Откройте TG TOP, чтобы посмотреть статистику.",
  ].join("\\n");
  try {
    const response = await axios.post<{ ok: boolean }>(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      chat_id: chatId,
      text,
      reply_markup: { inline_keyboard: [[{ text: "Открыть TG TOP", web_app: { url: miniAppUrl } }]] },
    }, { timeout: 15_000 });
    return response.data.ok;
  } catch (error) {
    console.warn("[Telegram] Could not send reward notification:", error);
    return false;
  }
}`;

code = code.replace(textToReplace1, '');
code = code.replace(textToReplace2, '');

const existing = `export async function notifyRewardCredited(input: { telegramUserId: number; groupTitle: string; amount: number }) {
  if (!botToken) return false;
  const amount = (input.amount / 100).toFixed(2).replace(/\\.?0+$/, "");
  const text = [
    "✅ GRAM зачислены на баланс",
    "",
    \`+\${amount} GRAM · \${input.groupTitle}\`,
    "Баланс и история в TG TOP обновятся автоматически.",
  ].join("\\n");
  try {
    const response = await axios.post<{ ok: boolean }>(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      chat_id: input.telegramUserId,
      text,
      reply_markup: { inline_keyboard: [[{ text: "Открыть баланс", web_app: { url: miniAppUrl } }]] },
    }, { timeout: 15_000 });
    return response.data.ok;
  } catch (error) {
    console.warn("[Telegram] Could not send reward-credit notification:", error);
    return false;
  }
}`;

const improved = `export async function notifyRewardCredited(input: { telegramUserId: number; groupTitle: string; amount: number; reason?: string }) {
  if (!botToken) return false;
  const amount = (input.amount / 100).toFixed(2).replace(/\\.?0+$/, "");
  const text = [
    "✅ GRAM зачислены на баланс",
    "",
    \`+\${amount} GRAM · \${input.groupTitle}\`,
    input.reason ? \`Основание: \${input.reason}\` : "",
    "",
    "Баланс и история в TG TOP обновятся автоматически.",
  ].filter(line => line !== "").join("\\n");
  try {
    const response = await axios.post<{ ok: boolean }>(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      chat_id: input.telegramUserId,
      text,
      reply_markup: { inline_keyboard: [[{ text: "Открыть баланс", web_app: { url: miniAppUrl } }]] },
    }, { timeout: 15_000 });
    return response.data.ok;
  } catch (error) {
    console.warn("[Telegram] Could not send reward-credit notification:", error);
    return false;
  }
}`;

code = code.replace(existing, improved);
fs.writeFileSync('server/telegramNotifications.ts', code);
