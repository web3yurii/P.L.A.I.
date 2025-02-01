// We need to add the following:
// basically wrap rpc requests, query, and response
// TODO : Assert type safety for the requests
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
//chain imports
import {
    ChainGrpcAuctionApi,
    ChainGrpcAuthApi,
    ChainGrpcAuthZApi,
    ChainGrpcBankApi,
    ChainGrpcDistributionApi,
    ChainGrpcExchangeApi,
    ChainGrpcGovApi,
    ChainGrpcIbcApi,
    ChainGrpcInsuranceFundApi,
    ChainGrpcMintApi,
    ChainGrpcOracleApi,
    ChainGrpcPeggyApi,
    ChainGrpcPermissionsApi,
    ChainGrpcStakingApi,
    ChainGrpcTendermintApi,
    ChainGrpcTokenFactoryApi,
    ChainGrpcWasmApi,
    ChainGrpcWasmXApi,
    MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
//indexer imports
import {
    IndexerGrpcAccountApi,
    IndexerGrpcArchiverApi,
    IndexerGrpcAuctionApi,
    IndexerGrpcDerivativesApi,
    IndexerGrpcExplorerApi,
    IndexerGrpcInsuranceFundApi,
    IndexerGrpcMitoApi,
    IndexerGrpcOracleApi,
    IndexerGrpcAccountPortfolioApi,
    IndexerGrpcSpotApi,
    IndexerGrpcTradingApi,
    IndexerGrpcWeb3GwApi,
} from "@injectivelabs/sdk-ts";
//minimal rest imports
import {
    ChainRestAuthApi,
    ChainRestTendermintApi,
    getInjectiveAddress,
    getEthereumAddress,
} from "@injectivelabs/sdk-ts";

export type RequestMethod<TRequest, TResponse> = (
    request: TRequest
) => Promise<TResponse>;

export interface GrpcRequestOptions<TRequest> {
    method: RequestMethod<TRequest, any>;
    params: TRequest;
    endpoint?: string;
}

export interface GrpcQueryOptions<TRequest> {
    method: RequestMethod<TRequest, any>;
    params: TRequest;
    endpoint?: string;
}

export class InjectiveGrpcBase {
    protected readonly network: Network;
    protected readonly endpoints: ReturnType<typeof getNetworkEndpoints>;
    //rest for auth
    protected readonly chainRestAuthApi: ChainRestAuthApi;
    protected readonly chainRestTendermintApi: ChainRestTendermintApi;
    //add all chain grpc endpoints here
    protected readonly chainGrpcAuctionApi: ChainGrpcAuctionApi;
    protected readonly chainGrpcAuthApi: ChainGrpcAuthApi;
    protected readonly chainGrpcAuthZApi: ChainGrpcAuthZApi;
    protected readonly chainGrpcBankApi: ChainGrpcBankApi;
    protected readonly chainGrpcDistributionApi: ChainGrpcDistributionApi;
    protected readonly chainGrpcExchangeApi: ChainGrpcExchangeApi;
    protected readonly chainGrpcGovApi: ChainGrpcGovApi;
    protected readonly chainGrpcIbcApi: ChainGrpcIbcApi;
    protected readonly chainGrpcInsuranceFundApi: ChainGrpcInsuranceFundApi;
    protected readonly chainGrpcMintApi: ChainGrpcMintApi;
    protected readonly chainGrpcOracleApi: ChainGrpcOracleApi;
    protected readonly chainGrpcPeggyApi: ChainGrpcPeggyApi;
    protected readonly chainGrpcPermissionsApi: ChainGrpcPermissionsApi;
    protected readonly chainGrpcStakingApi: ChainGrpcStakingApi;
    protected readonly chainGrpcTendermintApi: ChainGrpcTendermintApi;
    protected readonly chainGrpcTokenFactoryApi: ChainGrpcTokenFactoryApi;
    protected readonly chainGrpcWasmApi: ChainGrpcWasmApi;
    protected readonly chainGrpcWasmXApi: ChainGrpcWasmXApi;

    //add all indexer grpc endpoints here
    protected readonly indexerGrpcAuctionApi: IndexerGrpcAuctionApi;
    //these are majorly exchange module's
    protected readonly indexerGrpcDerivativesApi: IndexerGrpcDerivativesApi;
    protected readonly indexerGrpcAccountApi: IndexerGrpcAccountApi;
    protected readonly indexerGrpcAccountPortfolioApi: IndexerGrpcAccountPortfolioApi;
    protected readonly indexerGrpcSpotApi: IndexerGrpcSpotApi;
    protected readonly indexerGrpcInsuranceFundApi: IndexerGrpcInsuranceFundApi;
    protected readonly indexerGrpcTradingApi: IndexerGrpcTradingApi;
    protected readonly indexerGrpcArchiverApi: IndexerGrpcArchiverApi;

    //this is explorer import
    protected readonly indexerGrpcExplorerApi: IndexerGrpcExplorerApi;

    protected readonly indexerGrpcMitoApi: IndexerGrpcMitoApi;
    protected readonly indexerGrpcOracleApi: IndexerGrpcOracleApi;
    protected readonly indexerGrpcWeb3GwApi: IndexerGrpcWeb3GwApi;

    protected readonly ethAddress: string;
    protected readonly injAddress: string;
    private privateKey: string;
    protected msgBroadcaster!: MsgBroadcasterWithPk;
    constructor(
        protected readonly networkType: keyof typeof Network = "Mainnet",
        protected readonly injectivePrivateKey: string,
        protected readonly ethPublicKey?: string,
        protected readonly injPublicKey?: string
    ) {
        this.network = Network[networkType];
        this.endpoints = getNetworkEndpoints(this.network);
        //Initialize the broadcaster

        // Initialize Chain gRPCs
        this.chainGrpcAuctionApi = new ChainGrpcAuctionApi(this.endpoints.grpc);
        this.chainGrpcAuthApi = new ChainGrpcAuthApi(this.endpoints.grpc);
        this.chainGrpcAuthZApi = new ChainGrpcAuthZApi(this.endpoints.grpc);
        this.chainGrpcBankApi = new ChainGrpcBankApi(this.endpoints.grpc);
        this.chainGrpcDistributionApi = new ChainGrpcDistributionApi(
            this.endpoints.grpc
        );
        this.chainGrpcExchangeApi = new ChainGrpcExchangeApi(
            this.endpoints.grpc
        );
        this.chainGrpcGovApi = new ChainGrpcGovApi(this.endpoints.grpc);
        this.chainGrpcIbcApi = new ChainGrpcIbcApi(this.endpoints.grpc);
        this.chainGrpcInsuranceFundApi = new ChainGrpcInsuranceFundApi(
            this.endpoints.grpc
        );
        this.chainGrpcMintApi = new ChainGrpcMintApi(this.endpoints.grpc);
        this.chainGrpcOracleApi = new ChainGrpcOracleApi(this.endpoints.grpc);
        this.chainGrpcPeggyApi = new ChainGrpcPeggyApi(this.endpoints.grpc);
        this.chainGrpcPermissionsApi = new ChainGrpcPermissionsApi(
            this.endpoints.grpc
        );
        this.chainGrpcStakingApi = new ChainGrpcStakingApi(this.endpoints.grpc);
        this.chainGrpcTendermintApi = new ChainGrpcTendermintApi(
            this.endpoints.grpc
        );
        this.chainGrpcTokenFactoryApi = new ChainGrpcTokenFactoryApi(
            this.endpoints.grpc
        );
        this.chainGrpcWasmApi = new ChainGrpcWasmApi(this.endpoints.grpc);
        this.chainGrpcWasmXApi = new ChainGrpcWasmXApi(this.endpoints.grpc);

        // Initialize Indexer gRPCs
        // All exchange related functions
        this.indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
            this.endpoints.indexer
        );
        this.indexerGrpcAccountApi = new IndexerGrpcAccountApi(
            this.endpoints.indexer
        );
        this.indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(
            this.endpoints.indexer
        );
        this.indexerGrpcAccountPortfolioApi =
            new IndexerGrpcAccountPortfolioApi(this.endpoints.indexer);
        this.indexerGrpcTradingApi = new IndexerGrpcTradingApi(
            this.endpoints.indexer
        );
        this.indexerGrpcSpotApi = new IndexerGrpcSpotApi(
            this.endpoints.indexer
        );
        // End of exchange functions
        this.indexerGrpcArchiverApi = new IndexerGrpcArchiverApi(
            this.endpoints.indexer
        );
        this.indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(
            this.endpoints.indexer
        );
        this.indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(
            this.endpoints.indexer
        );
        //TODO: WARNING replace with testnet env, dont leave this hardcoded
        const MITO_API_ENDPOINT =
            "https://k8s.mainnet.mito.grpc-web.injective.network";
        this.indexerGrpcMitoApi = new IndexerGrpcMitoApi(MITO_API_ENDPOINT);
        this.indexerGrpcOracleApi = new IndexerGrpcOracleApi(
            this.endpoints.indexer
        );
        this.indexerGrpcWeb3GwApi = new IndexerGrpcWeb3GwApi(
            this.endpoints.indexer
        );

        // Minimal REST endpoint - TODO: need to move this into REST client

        this.chainRestAuthApi = new ChainRestAuthApi(this.endpoints.rest);
        this.chainRestTendermintApi = new ChainRestTendermintApi(
            this.endpoints.rest
        );

        // Initialize EthAddress and InjAddress
        this.ethAddress =
            ethPublicKey ||
            (injPublicKey ? getEthereumAddress(injPublicKey) : "");

        this.injAddress =
            injPublicKey ||
            (ethPublicKey ? getInjectiveAddress(ethPublicKey) : "");

        this.privateKey = injectivePrivateKey;

        this.msgBroadcaster = new MsgBroadcasterWithPk({
            network: this.network,
            privateKey: this.privateKey,
        });
    }
    /**
     * Get network configuration
     * @returns Current network endpoints
     */
    protected getNetworkConfig() {
        return {
            network: this.network,
            endpoints: this.endpoints,
        };
    }

    /**
     * Check if the connection is alive
     * @returns Promise resolving to boolean indicating connection status
     */
    protected async isConnectionAlive(): Promise<boolean> {
        try {
            await this.chainGrpcAuthApi.fetchModuleParams();
            return true;
        } catch {
            return false;
        }
    }
}
