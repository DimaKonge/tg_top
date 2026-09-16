import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Sparkles,
  Wallet,
  Gift,
  AtSign,
  Hash,
  Trophy,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import type { Language, WalletNft } from "@/lib/tgTop-domain";

interface NftListingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  initialUsername?: string;
  initialAssetClass?: "onchain" | "offchain";
  initialItemAddress?: string;
  ownerWalletAddress?: string | null;
  onSuccess?: () => void;
}

export function NftListingSheet({
  open,
  onOpenChange,
  language,
  initialUsername = "",
  initialAssetClass = "offchain",
  initialItemAddress = "",
  ownerWalletAddress,
  onSuccess,
}: NftListingSheetProps) {
  const tx = (ru: string, en: string) => (language === "en" ? en : ru);

  const [selectedNft, setSelectedNft] = useState<WalletNft | null>(null);
  const [username, setUsername] = useState(initialUsername);
  const [assetClass, setAssetClass] = useState<"onchain" | "offchain">(initialAssetClass);
  const [itemAddress, setItemAddress] = useState(initialItemAddress);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("gifts");

  // Mode: "auction" (Bid for ranking) | "sale" (Direct sale) | "rent" (Rent & Installments)
  const [listingMode, setListingMode] = useState<"auction" | "sale" | "rent">("auction");

  // Auction bid & sale prices
  const [bidTon, setBidTon] = useState("50");
  const [priceTon, setPriceTon] = useState("100");
  const [rentPriceDay, setRentPriceDay] = useState("0.5");
  const [rentMinDays, setRentMinDays] = useState(7);
  const [rentMaxDays, setRentMaxDays] = useState(180);

  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
  const [installmentDownPayment, setInstallmentDownPayment] = useState("20");
  const [installmentDays, setInstallmentDays] = useState(30);

  const [activeFilter, setActiveFilter] = useState<"all" | "gifts" | "usernames">("all");

  // Query wallet NFTs via TonAPI
  const walletNftsQuery = trpc.tgTop.getWalletNfts.useQuery(
    { walletAddress: ownerWalletAddress || "" },
    { enabled: Boolean(ownerWalletAddress && open) }
  );

  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
    if (initialAssetClass) {
      setAssetClass(initialAssetClass);
    }
    if (initialItemAddress) {
      setItemAddress(initialItemAddress);
    }
  }, [initialUsername, initialAssetClass, initialItemAddress]);

  const selectWalletItem = (item: WalletNft) => {
    setSelectedNft(item);
    setUsername(item.name.replace(/^@/, "").trim());
    setItemAddress(item.address);
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setAssetClass("offchain");
    toast.success(tx(`Выбран актив: ${item.name}`, `Selected asset: ${item.name}`));
  };

  const createNftMutation = trpc.tgTop.createNft.useMutation({
    onSuccess: () => {
      toast.success(tx("Актив успешно добавлен в ТОП NFT!", "Asset successfully published to TOP NFT!"));
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || tx("Ошибка публикации NFT", "Failed to publish NFT"));
    },
  });

  const walletItems = walletNftsQuery.data?.items || [];
  const filteredWalletItems = walletItems.filter((it) => {
    if (activeFilter === "gifts") return it.category === "gifts";
    if (activeFilter === "usernames") return it.category === "usernames";
    return true;
  });

  const handlePublish = () => {
    const finalPrice = listingMode === "auction" ? `${bidTon} TON` : `${priceTon} TON`;
    const finalPriceAmount = listingMode === "auction" ? Number(bidTon) || 50 : Number(priceTon) || 100;

    const modes: string[] = [];
    if (listingMode === "auction") modes.push("auction", "sale");
    if (listingMode === "sale") modes.push("sale");
    if (listingMode === "rent") modes.push("rent");
    if (installmentsEnabled) modes.push("installments");

    createNftMutation.mutate({
      username: username.trim(),
      price: finalPrice,
      priceAmount: finalPriceAmount,
      rentalPricePerDay: `${rentPriceDay} TON`,
      rentalAmountPerDay: Number(rentPriceDay) || 0,
      minRentalDays: rentMinDays,
      maxRentalDays: rentMaxDays,
      listingType: listingMode === "rent" ? "rent" : "sale",
      assetClass: "offchain",
      nftItemAddress: itemAddress || undefined,
      ownerWalletAddress: ownerWalletAddress || undefined,
      installmentsEnabled: installmentsEnabled,
      installmentsDownPayment: Number(installmentDownPayment) || 0,
      installmentsPeriodDays: installmentDays,
      installmentsTotalPrice: finalPriceAmount,
      modes,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-[28px] border-white/10 bg-[#0e141d] p-0 text-slate-100 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#0e141d]/90 px-5 py-4 backdrop-blur-md">
          <SheetHeader className="text-left">
            <SheetTitle className="text-base font-bold text-slate-100">
              {tx("Добавить NFT / Подарок в ТОП", "Add NFT / Gift to TOP")}
            </SheetTitle>
          </SheetHeader>
          <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
            {tx("Аукцион мест", "Top Auction")}
          </span>
        </div>

        <div className="space-y-4 px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4">
          {/* Section 1: TON Connect Wallet Asset Detection (Option A) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#3f8cff]" />
                <span className="text-xs font-semibold text-slate-200">
                  {tx("Ваши активы из TON Connect", "Your TON Connect Assets")}
                </span>
              </div>
              {ownerWalletAddress && (
                <span className="font-mono text-[10px] text-slate-400">
                  {ownerWalletAddress.slice(0, 6)}…{ownerWalletAddress.slice(-4)}
                </span>
              )}
            </div>

            {ownerWalletAddress ? (
              <div>
                {/* Category tabs */}
                <div className="flex items-center gap-1.5 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                      activeFilter === "all"
                        ? "bg-[#3f8cff] text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {tx("Все", "All")} ({walletItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("gifts")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                      activeFilter === "gifts"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {tx("Подарки", "Gifts")} (
                    {walletItems.filter((i) => i.category === "gifts").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("usernames")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                      activeFilter === "usernames"
                        ? "bg-[#3f8cff] text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {tx("Юзернеймы", "Usernames")} (
                    {walletItems.filter((i) => i.category === "usernames").length})
                  </button>
                </div>

                {/* Items carousel/grid */}
                {walletNftsQuery.isLoading ? (
                  <div className="flex h-20 items-center justify-center gap-2 rounded-xl bg-white/[0.02] text-xs text-slate-400">
                    <RefreshCw className="h-4 w-4 animate-spin text-[#3f8cff]" />
                    <span>{tx("Сканируем активы кошелька…", "Scanning wallet assets…")}</span>
                  </div>
                ) : filteredWalletItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {filteredWalletItems.map((item) => {
                      const isSelected = selectedNft?.address === item.address || username === item.name;
                      return (
                        <button
                          key={item.address}
                          type="button"
                          onClick={() => selectWalletItem(item)}
                          className={`group relative flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                            isSelected
                              ? "border-[#3f8cff] bg-[#3f8cff]/15 ring-1 ring-[#3f8cff]"
                              : "border-white/10 bg-[#141b24] hover:border-white/20"
                          }`}
                        >
                          <div className="relative mb-1.5 flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-[#182330]">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              item.category === "gifts" ? <Gift className="h-5 w-5 text-amber-300" /> : <AtSign className="h-5 w-5 text-[#82b6ff]" />
                            )}
                          </div>
                          <span className="w-full truncate text-[10px] font-semibold text-slate-200 group-hover:text-[#a6c8ff]">
                            {item.name}
                          </span>
                          <span className="text-[8px] text-slate-400 capitalize">{item.category}</span>
                          {isSelected && (
                            <CheckCircle2 className="absolute top-1 right-1 h-3.5 w-3.5 text-[#3f8cff]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 p-3 text-center text-xs text-slate-400">
                    {tx("На кошельке не найдено подходящих Telegram Gifts или Fragment юзернеймов.", "No Telegram Gifts or Fragment usernames found on connected wallet.")}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-xs text-slate-300">
                  {tx("Подключите TON-кошелек для мгновенного выбора подарков и юзернеймов", "Connect TON wallet to automatically select your gifts & usernames")}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Asset identification */}
          <div className="space-y-2.5 rounded-2xl border border-white/8 bg-white/[0.02] p-3.5">
            <label className="text-xs font-semibold text-slate-300">
              {tx("Название актива / Telegram Юзернейм / Подарок", "Asset Name / Telegram Username / Gift")}
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/^@/, "").trim())}
              placeholder="durov или Telegram Gift #4928"
              className="h-11 border-white/10 bg-[#141b24] px-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-[#3f8cff]"
            />
            {itemAddress && (
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] text-slate-400">
                <span>{tx("Смарт-контракт / Адрес:", "Smart-contract / Address:")}</span>
                <span className="font-mono text-slate-300">{itemAddress.slice(0, 10)}…{itemAddress.slice(-6)}</span>
              </div>
            )}
          </div>

          {/* Section 3: Listing Mechanic Selection */}
          <div className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.02] p-3.5">
            <label className="text-xs font-semibold text-slate-300">
              {tx("Механика размещения в ТОП", "Top Placement Mechanic")}
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setListingMode("auction")}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  listingMode === "auction"
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/40"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Trophy className="mb-1 h-4 w-4 text-amber-300" />
                <span className="text-xs font-bold">{tx("Аукцион мест", "Top Auction")}</span>
                <span className="text-[8px] text-slate-400">{tx("Борьба за #1", "Fight for #1")}</span>
              </button>

              <button
                type="button"
                onClick={() => setListingMode("sale")}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  listingMode === "sale"
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/40"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Sparkles className="mb-1 h-4 w-4 text-emerald-300" />
                <span className="text-xs font-bold">{tx("Продажа", "Direct Sale")}</span>
                <span className="text-[8px] text-slate-400">{tx("Фикс. цена", "Fixed Price")}</span>
              </button>

              <button
                type="button"
                onClick={() => setListingMode("rent")}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  listingMode === "rent"
                    ? "border-[#3f8cff]/50 bg-[#3f8cff]/15 text-[#a6c8ff] ring-1 ring-[#3f8cff]/40"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <AtSign className="mb-1 h-4 w-4 text-[#82b6ff]" />
                <span className="text-xs font-bold">{tx("Аренда", "Rent")}</span>
                <span className="text-[8px] text-slate-400">{tx("По дням", "Per Day")}</span>
              </button>
            </div>
          </div>

          {/* Dynamic configuration by mode */}
          {listingMode === "auction" && (
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-200">
                  {tx("Ставка за место в ТОП (TON)", "Top Auction Bid (TON)")}
                </label>
                <span className="text-[10px] text-amber-300/80">{tx("Мин: 10 TON", "Min: 10 TON")}</span>
              </div>
              <Input
                type="number"
                step="1"
                min="10"
                value={bidTon}
                onChange={(e) => setBidTon(e.target.value)}
                className="h-11 border-amber-500/30 bg-[#141b24] px-3.5 text-base font-bold text-amber-200"
              />
              <p className="text-[10px] leading-relaxed text-amber-200/70">
                {tx(
                  "Чем выше ваша ставка, тем выше позиция актива в рейтинге ТОП NFT (слоты #1, #2, #3).",
                  "The higher your bid, the higher your asset ranks in the TOP NFT board (#1, #2, #3)."
                )}
              </p>
            </div>
          )}

          {listingMode === "sale" && (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 space-y-2">
              <label className="text-xs font-bold text-emerald-200">
                {tx("Цена продажи (TON)", "Sale Price (TON)")}
              </label>
              <Input
                type="number"
                step="1"
                min="1"
                value={priceTon}
                onChange={(e) => setPriceTon(e.target.value)}
                className="h-11 border-emerald-500/30 bg-[#141b24] px-3.5 text-base font-bold text-emerald-200"
              />
            </div>
          )}

          {listingMode === "rent" && (
            <div className="rounded-2xl border border-[#3f8cff]/25 bg-[#3f8cff]/10 p-3.5 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#a6c8ff]">
                  {tx("Стоимость аренды (TON / день)", "Rental Rate (TON / day)")}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={rentPriceDay}
                  onChange={(e) => setRentPriceDay(e.target.value)}
                  className="mt-1.5 h-10 border-[#3f8cff]/30 bg-[#141b24] px-3 text-sm text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">{tx("Мин. дней", "Min days")}</label>
                  <Input
                    type="number"
                    min="1"
                    value={rentMinDays}
                    onChange={(e) => setRentMinDays(parseInt(e.target.value) || 1)}
                    className="mt-1 h-9 bg-[#141b24] text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{tx("Макс. дней", "Max days")}</label>
                  <Input
                    type="number"
                    min="1"
                    value={rentMaxDays}
                    onChange={(e) => setRentMaxDays(parseInt(e.target.value) || 30)}
                    className="mt-1 h-9 bg-[#141b24] text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={createNftMutation.isPending || !username.trim()}
              onClick={handlePublish}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3f8cff] to-[#2563eb] text-sm font-bold text-white shadow-lg shadow-[#3f8cff]/25 transition-all hover:brightness-110 disabled:opacity-40 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              {createNftMutation.isPending
                ? tx("Публикация в ТОП…", "Publishing to TOP…")
                : tx("Залистить актив в ТОП", "Publish Asset to TOP")}
            </button>
            <p className="mt-2 text-center text-[10px] text-slate-500">
              {tx(
                "Все сделки и аукционы защищены протоколом TG TOP Сейф.",
                "All deals and auctions are secured by TG TOP Vault protocol."
              )}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NftListingSheet;
