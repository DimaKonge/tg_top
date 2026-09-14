import fs from 'fs';
let code = fs.readFileSync('server/tonPayoutWallet.ts', 'utf8');

const target = `  const value = payload.transaction?.total_fees
    ?? payload.trace?.transaction?.total_fees
    ?? payload.transactions?.[0]?.total_fees;
  try {`;

const replacement = `  const success = payload.transaction?.success
    ?? payload.trace?.transaction?.success
    ?? payload.transactions?.[0]?.success;
  
  if (success === false) {
    throw new Error("Транзакция завершится ошибкой (вероятно, недостаточно средств на горячем кошельке)");
  }

  const value = payload.transaction?.total_fees
    ?? payload.trace?.transaction?.total_fees
    ?? payload.transactions?.[0]?.total_fees;
  try {`;

code = code.replace(target, replacement);
fs.writeFileSync('server/tonPayoutWallet.ts', code);
