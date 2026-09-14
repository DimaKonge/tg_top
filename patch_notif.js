import fs from 'fs';
let code = fs.readFileSync('server/telegramNotifications.ts', 'utf8');

const target = `export async function notifyCommunityEntryLinkRevalidated(input: { openId: string; groupTitle: string; username: string }) {`;

const replacement = `export async function notifyRewardCredited(input: { openId: string; amountTon: number; reason: string }) {
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
}

export async function notifyCommunityEntryLinkRevalidated(input: { openId: string; groupTitle: string; username: string }) {`;

code = code.replace(target, replacement);
fs.writeFileSync('server/telegramNotifications.ts', code);
