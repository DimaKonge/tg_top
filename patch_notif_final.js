import fs from 'fs';
let code = fs.readFileSync('/tmp/tgtop2/server/telegramNotifications.ts', 'utf8');

const target = `export async function notifyRewardCredited(input: { telegramUserId: number; groupTitle: string; amount: number; reason?: string }) {
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
  try {`;

const replacement = `export async function notifyRewardCredited(input: { telegramUserId: number; groupTitle: string; amount: number; reason?: string }) {
  if (!botToken) return false;
  const amount = (input.amount / 100).toFixed(2).replace(/\\.?0+$/, "");
  const text = [
    "🎉 Бонус начислен!",
    "",
    \`+\${amount} GRAM за вступление в группу \${input.groupTitle}\`,
    input.reason ? \`(\${input.reason})\` : "",
    "",
    "Откройте TG TOP, чтобы просмотреть ваш баланс.",
  ].filter(line => line !== "").join("\\n");
  try {`;

code = code.replace(target, replacement);
fs.writeFileSync('/tmp/tgtop2/server/telegramNotifications.ts', code);
