import fs from 'fs';
let code = fs.readFileSync('server/telegramNotifications.ts', 'utf8');

const target = `export async function notifyRewardCredited(input: { telegramUserId: number; groupTitle: string; amount: number }) {
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
    }, { timeout: 15_000 });
    return response.data.ok;
  } catch (error) {
    console.warn("[Telegram] Could not send reward notification:", error);
    return false;
  }
}`;

const replacement = `export async function notifyRewardCredited(input: { telegramUserId: number; groupTitle: string; amount: number }) {
  if (!botToken) return false;
  const amount = (input.amount / 100).toFixed(2).replace(/\\.?0+$/, "");
  const text = [
    "✅ Бонус зачислен!",
    "",
    \`+\${amount} GRAM за вступление в группу \${input.groupTitle}\`,
    "",
    "Ваш баланс успешно пополнен. Откройте TG TOP, чтобы просмотреть статистику.",
  ].join("\\n");
  try {
    const response = await axios.post<{ ok: boolean }>(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      chat_id: input.telegramUserId,
      text,
      reply_markup: { inline_keyboard: [[{ text: "Открыть TG TOP", web_app: { url: miniAppUrl } }]] },
    }, { timeout: 15_000 });
    return response.data.ok;
  } catch (error) {
    console.warn("[Telegram] Could not send reward notification:", error);
    return false;
  }
}`;

code = code.replace(target, replacement);
fs.writeFileSync('server/telegramNotifications.ts', code);
