import type { ICacheManager } from "@elizaos/core";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { BirdeyeProvider } from "../birdeye";
import {
    API_BASE_URL,
    BIRDEYE_ENDPOINTS,
    DEFAULT_SUPPORTED_SYMBOLS,
} from "../constants";
import { convertToStringParams } from "../utils";

describe("BirdeyeProvider", () => {
    let cacheManager: ICacheManager;
    let provider: BirdeyeProvider;

    beforeEach(() => {
        cacheManager = {
            get: vi.fn(),
            set: vi.fn(),
        } as unknown as ICacheManager;
        provider = new BirdeyeProvider(cacheManager);
        global.fetch = vi.fn();

        vi.mock("@elizaos/core", () => ({
            settings: {
                get: vi.fn().mockImplementation((key) => {
                    if (key === "BIRDEYE_API_KEY")
                        return process.env.BIRDEYE_API_KEY || "test-api-key";
                    if (key === "BIRDEYE_CHAIN") return "solana";
                    return undefined;
                }),
            },
            ICacheManager: vi.fn(),
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const mockSuccessResponse = (data: any) => {
        (fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ data, success: true }),
        });
    };

    const expectFetchCall = (
        endpoint: string,
        params?: any,
        method = "GET"
    ) => {
        const url = `${API_BASE_URL}${endpoint}${
            params && method === "GET"
                ? `?${new URLSearchParams(convertToStringParams(params))}`
                : ""
        }`;

        expect(fetch).toHaveBeenCalledWith(url, expect.anything());
    };

    describe("Defi Endpoints", () => {
        it("should fetch supported networks", async () => {
            const mockData = { chains: ["solana", "ethereum"] };
            mockSuccessResponse(mockData);
            const result = await provider.fetchDefiSupportedNetworks();
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.defi.networks);
        });

        it("should fetch price", async () => {
            const mockData = { value: 100 };
            mockSuccessResponse(mockData);
            const result = await provider.fetchDefiPrice({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.defi.price, {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
        });

        it("should fetch multiple prices", async () => {
            const mockData = { prices: {} };
            mockSuccessResponse(mockData);
            const result = await provider.fetchDefiPriceMultiple({
                list_address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.defi.price_multi, {
                list_address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
        });

        it("should fetch multiple prices via POST", async () => {
            const mockData = { prices: {} };
            mockSuccessResponse(mockData);
            const result = await provider.fetchDefiPriceMultiple_POST({
                list_address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(
                BIRDEYE_ENDPOINTS.defi.price_multi_POST,
                { list_address: DEFAULT_SUPPORTED_SYMBOLS.SOL },
                "POST"
            );
        });

        it("should fetch historical price", async () => {
            const mockData = { items: [] };
            mockSuccessResponse(mockData);
            const result = await provider.fetchDefiPriceHistorical({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                type: "1H",
                address_type: "token",
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.defi.history_price, {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                type: "1H",
                address_type: "token",
            });
        });
    });

    describe("Token Endpoints", () => {
        it("should fetch token list", async () => {
            const mockData = { tokens: [] };
            mockSuccessResponse(mockData);
            const result = await provider.fetchTokenList({});
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.token.list_all, {});
        });

        it("should fetch token security", async () => {
            const mockData = {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                totalSupply: 1000000,
                mintable: false,
                proxied: false,
                ownerAddress: "owner123",
                creatorAddress: "creator123",
                securityChecks: {
                    honeypot: false,
                    trading_cooldown: false,
                    transfer_pausable: false,
                    is_blacklisted: false,
                    is_whitelisted: false,
                    is_proxy: false,
                    is_mintable: false,
                    can_take_back_ownership: false,
                    hidden_owner: false,
                    anti_whale_modifiable: false,
                    is_anti_whale: false,
                    trading_pausable: false,
                    can_be_blacklisted: false,
                    is_true_token: true,
                    is_airdrop_scam: false,
                    slippage_modifiable: false,
                    is_honeypot: false,
                    transfer_pausable_time: false,
                    is_wrapped: false,
                },
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchTokenSecurityByAddress({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.token.security, {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
        });

        it("should fetch token overview", async () => {
            const mockData = {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                decimals: 9,
                symbol: "SOL",
                name: "Solana",
                extensions: {
                    coingeckoId: "solana",
                    website: "https://solana.com",
                    telegram: "solana",
                    twitter: "solana",
                    description: "Solana blockchain token",
                },
                logoURI: "https://example.com/sol.png",
                liquidity: 1000000,
                price: 100,
                priceChange24hPercent: 5,
                uniqueWallet24h: 1000,
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchTokenOverview({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.token.overview, {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
        });

        it("should fetch token trending", async () => {
            const mockData = {
                updateUnixTime: 1234567890,
                updateTime: "2024-01-01T00:00:00Z",
                tokens: [],
                total: 0,
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchTokenTrending();
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.token.trending);
        });
    });

    describe("Wallet Endpoints", () => {
        it("should fetch wallet portfolio", async () => {
            const mockData = {
                wallet: "test-wallet",
                totalUsd: 1000,
                items: [
                    {
                        address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                        name: "Solana",
                        symbol: "SOL",
                        decimals: 9,
                        balance: "1000000000",
                        uiAmount: 1,
                        chainId: "solana",
                        logoURI: "https://example.com/sol.png",
                        priceUsd: 100,
                        valueUsd: 100,
                    },
                ],
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchWalletPortfolio({
                wallet: "test-wallet",
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.wallet.portfolio, {
                wallet: "test-wallet",
            });
        });

        it("should fetch wallet token balance", async () => {
            const mockData = {
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                name: "Solana",
                symbol: "SOL",
                decimals: 9,
                balance: 1000000000,
                uiAmount: 1,
                chainId: "solana",
                priceUsd: 100,
                valueUsd: 100,
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchWalletTokenBalance({
                wallet: "test-wallet",
                token_address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.wallet.token_balance, {
                wallet: "test-wallet",
                token_address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });
        });
    });

    describe("Pair Endpoints", () => {
        it("should fetch pair overview", async () => {
            const mockData = {
                address: "pair-address",
                name: "SOL/USDC",
                base: {
                    address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                    decimals: 9,
                    icon: "https://example.com/sol.png",
                    symbol: "SOL",
                },
                quote: {
                    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    decimals: 6,
                    icon: "https://example.com/usdc.png",
                    symbol: "USDC",
                },
                created_at: "2024-01-01T00:00:00Z",
                source: "Raydium",
                liquidity: 1000000,
                liquidity_change_percentage_24h: 5,
                price: 100,
                volume_24h: 1000000,
                volume_24h_change_percentage_24h: 10,
                trade_24h: 1000,
                trade_24h_change_percent: 15,
                unique_wallet_24h: 500,
                unique_wallet_24h_change_percent: 20,
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchPairOverviewSingle({
                address: "pair-address",
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.pair.overview_single, {
                address: "pair-address",
            });
        });

        it("should fetch multiple pair overview", async () => {
            const mockData = {
                "pair-1": {
                    address: "pair-1",
                    name: "SOL/USDC",
                    base: {
                        address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                        decimals: 9,
                        icon: "https://example.com/sol.png",
                        symbol: "SOL",
                    },
                    quote: {
                        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        decimals: 6,
                        icon: "https://example.com/usdc.png",
                        symbol: "USDC",
                    },
                    created_at: "2024-01-01T00:00:00Z",
                    source: "Raydium",
                    liquidity: 1000000,
                    liquidity_change_percentage_24h: 5,
                    price: 100,
                    volume_24h: 1000000,
                    volume_24h_change_percentage_24h: 10,
                    trade_24h: 1000,
                    trade_24h_change_percent: 15,
                    unique_wallet_24h: 500,
                    unique_wallet_24h_change_percent: 20,
                },
                "pair-2": {
                    address: "pair-2",
                    name: "BTC/USDC",
                    base: {
                        address: DEFAULT_SUPPORTED_SYMBOLS.BTC,
                        decimals: 8,
                        icon: "https://example.com/btc.png",
                        symbol: "BTC",
                    },
                    quote: {
                        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        decimals: 6,
                        icon: "https://example.com/usdc.png",
                        symbol: "USDC",
                    },
                    created_at: "2024-01-01T00:00:00Z",
                    source: "Raydium",
                    liquidity: 2000000,
                    liquidity_change_percentage_24h: 3,
                    price: 50000,
                    volume_24h: 2000000,
                    volume_24h_change_percentage_24h: 8,
                    trade_24h: 500,
                    trade_24h_change_percent: 12,
                    unique_wallet_24h: 300,
                    unique_wallet_24h_change_percent: 15,
                },
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchMultiPairOverview({
                list_address: "pair-1,pair-2",
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.pair.overview_multi, {
                list_address: "pair-1,pair-2",
            });
        });
    });

    describe("Search Endpoints", () => {
        it("should fetch token market search", async () => {
            const mockData = {
                items: [
                    {
                        type: "token",
                        result: [
                            {
                                name: "Solana",
                                symbol: "SOL",
                                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                                fdv: 1000000000,
                                market_cap: 500000000,
                                liquidity: 1000000,
                                volume_24h_change_percent: 10,
                                price: 100,
                                price_change_24h_percent: 5,
                                buy_24h: 500,
                                buy_24h_change_percent: 15,
                                sell_24h: 300,
                                sell_24h_change_percent: -10,
                                trade_24h: 800,
                                trade_24h_change_percent: 8,
                                unique_wallet_24h: 1000,
                                unique_view_24h_change_percent: 20,
                                last_trade_human_time: "2024-01-01T00:00:00Z",
                                last_trade_unix_time: 1704067200,
                                creation_time: "2020-01-01T00:00:00Z",
                                volume_24h_usd: 1000000,
                                logo_uri: "https://example.com/sol.png",
                            },
                        ],
                    },
                ],
            };
            mockSuccessResponse(mockData);
            const result = await provider.fetchSearchTokenMarketData({
                keyword: "test",
            });
            expect(result.data).toEqual(mockData);
            expectFetchCall(BIRDEYE_ENDPOINTS.search.token_market, {
                keyword: "test",
            });
        });
    });

    describe("Caching", () => {
        beforeEach(() => {
            // Reset the provider with a fresh cache manager for each test
            cacheManager = {
                get: vi.fn(),
                set: vi.fn(),
            } as unknown as ICacheManager;
            provider = new BirdeyeProvider(cacheManager);
        });

        it("should use file system cache when available", async () => {
            const mockResponse = { data: { value: 100 }, success: true };
            (cacheManager.get as Mock).mockResolvedValue(mockResponse);

            const result = await provider.fetchDefiPrice({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });

            expect(result).toEqual(mockResponse);
            expect(fetch).not.toHaveBeenCalled();
            expect(cacheManager.get).toHaveBeenCalled();
        });

        it("should fetch and cache when cache misses", async () => {
            const mockResponse = { data: { value: 100 }, success: true };
            (cacheManager.get as Mock).mockResolvedValue(null);
            (fetch as Mock).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await provider.fetchDefiPrice({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });

            expect(result).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(cacheManager.set).toHaveBeenCalled();
        });
    });

    describe("Error Handling", () => {
        it("should retry on failure", async () => {
            (fetch as Mock)
                .mockRejectedValueOnce(new Error("Network error"))
                .mockRejectedValueOnce(new Error("Network error"))
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ data: { value: 100 }, success: true }),
                });

            const result = await provider.fetchDefiPrice({
                address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
            });

            expect(result).toEqual({ data: { value: 100 }, success: true });
            expect(fetch).toHaveBeenCalledTimes(3);
        });

        it("should throw after max retries", async () => {
            (fetch as Mock).mockRejectedValue(new Error("Network error"));

            await expect(
                provider.fetchDefiPrice({
                    address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                })
            ).rejects.toThrow("Network error");
            expect(fetch).toHaveBeenCalledTimes(3); // Default max retries
        });

        it("should handle non-200 responses", async () => {
            (fetch as Mock).mockResolvedValue({
                ok: false,
                status: 404,
                text: async () => "Not found",
            });

            await expect(
                provider.fetchDefiPrice({
                    address: DEFAULT_SUPPORTED_SYMBOLS.SOL,
                })
            ).rejects.toThrow("HTTP error! status: 404, message: Not found");
            expect(fetch).toHaveBeenCalledTimes(3); // Should still retry on HTTP errors
        });
    });
});
