import { describe, expect, it } from "vitest";
import { canOfferNftMode, getNftVaultAddress, normalizeNftListingModes, tryParseNftMetadata, validateInstallmentTerms, validateNftListingModes } from "./nftMarketplacePolicy";

describe("NFT marketplace listing modes", () => {
  it("allows a single NFT listing to expose several deal modes at once", () => {
    const modes = validateNftListingModes({ sale: true, auction: true, installments: true, rent: true });
    expect(modes).toEqual(["sale", "auction", "installments", "rent"]);
    expect(canOfferNftMode(modes, "auction")).toBe(true);
    expect(canOfferNftMode(modes, "collateral")).toBe(false);
  });

  it("does not create an empty listing", () => {
    expect(normalizeNftListingModes({})).toEqual([]);
    expect(() => validateNftListingModes({ collateral: false })).toThrow("Выберите хотя бы один режим сделки NFT");
  });

  it("validates installment terms and computes remaining balance", () => {
    const result = validateInstallmentTerms({
      totalPriceTon: 100,
      downPaymentTon: 25,
      periodDays: 30,
    });
    expect(result.isValid).toBe(true);
    expect(result.remainingTon).toBe(75);

    expect(() => validateInstallmentTerms({
      totalPriceTon: 100,
      downPaymentTon: 120,
      periodDays: 30,
    })).toThrow("Первоначальный взнос не может превышать полную стоимость");

    expect(() => validateInstallmentTerms({
      totalPriceTon: 100,
      downPaymentTon: 20,
      periodDays: 2,
    })).toThrow("Срок рассрочки должен быть от 7 до 365 дней");
  });

  it("generates deterministic vault address for secure smart-contract rental", () => {
    const vault = getNftVaultAddress("durov", 42);
    expect(vault).toBe("EQ_Vault_durov_42");
  });

  it("parses NFT metadata safely", () => {
    const parsed = tryParseNftMetadata('{"vaultAddress":"EQ_Vault_test","modes":["sale","rent"]}');
    expect(parsed?.vaultAddress).toBe("EQ_Vault_test");
    expect(parsed?.modes).toEqual(["sale", "rent"]);

    expect(tryParseNftMetadata("tg-top-internal")).toBeNull();
    expect(tryParseNftMetadata(null)).toBeNull();
  });
});
