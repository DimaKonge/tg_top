import { normalizeTonAddress } from "./tonDeposits";

/** Public payout wallet identity. This is intentionally separate from signing material. */
export function getConfiguredTonPayoutWalletAddress() {
  const configuredAddress = process.env.TON_PAYOUT_WALLET_ADDRESS?.trim() || process.env.TON_DEPOSIT_WALLET_ADDRESS?.trim();
  if (!configuredAddress) {
    return normalizeTonAddress("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ");
  }
  return normalizeTonAddress(configuredAddress);
}
