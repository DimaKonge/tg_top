export const NFT_LISTING_MODES = ["sale", "auction", "installments", "rent", "collateral"] as const;

export type NftListingMode = (typeof NFT_LISTING_MODES)[number];

export type NftListingModeSelection = Partial<Record<NftListingMode, boolean>>;

export function normalizeNftListingModes(input: NftListingModeSelection): NftListingMode[] {
  return NFT_LISTING_MODES.filter(mode => input[mode] === true);
}

export function validateNftListingModes(input: NftListingModeSelection): NftListingMode[] {
  const enabled = normalizeNftListingModes(input);
  if (!enabled.length) throw new Error("Выберите хотя бы один режим сделки NFT");
  return enabled;
}

export function canOfferNftMode(enabledModes: readonly NftListingMode[], mode: NftListingMode): boolean {
  return enabledModes.includes(mode);
}

export interface InstallmentTerms {
  totalPriceTon: number;
  downPaymentTon: number;
  periodDays: number;
}

export function validateInstallmentTerms(terms: InstallmentTerms) {
  const { totalPriceTon, downPaymentTon, periodDays } = terms;
  if (!Number.isFinite(totalPriceTon) || totalPriceTon <= 0) {
    throw new Error("Укажите корректную стоимость NFT для рассрочки");
  }
  if (!Number.isFinite(downPaymentTon) || downPaymentTon <= 0) {
    throw new Error("Первоначальный взнос должен быть больше нуля");
  }
  if (downPaymentTon > totalPriceTon) {
    throw new Error("Первоначальный взнос не может превышать полную стоимость");
  }
  if (!Number.isInteger(periodDays) || periodDays < 7 || periodDays > 365) {
    throw new Error("Срок рассрочки должен быть от 7 до 365 дней");
  }
  const remainingTon = Math.max(0, Number((totalPriceTon - downPaymentTon).toFixed(4)));
  return {
    isValid: true,
    totalPriceTon,
    downPaymentTon,
    periodDays,
    remainingTon,
  };
}

export function getNftVaultAddress(username: string, nftId?: number): string {
  const clean = username.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
  const idSuffix = nftId ? `_${nftId}` : "";
  return `EQ_Vault_${clean}${idSuffix}`;
}

export interface NftItemMetadata {
  vaultAddress?: string;
  installments?: {
    downPayment: string;
    periodDays: number;
    totalPrice: string;
  };
  modes?: string[];
  verification?: string;
}

export function tryParseNftMetadata(verification: string | null | undefined): NftItemMetadata | null {
  if (!verification || !verification.trim().startsWith("{")) return null;
  try {
    return JSON.parse(verification) as NftItemMetadata;
  } catch {
    return null;
  }
}
