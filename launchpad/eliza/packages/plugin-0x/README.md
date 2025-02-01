# @elizaos/plugin-0x

This plugin enables Eliza to interact with the 0x Protocol, providing decentralized exchange capabilities across multiple evm blockchain networks with optimized token swaps and liquidity aggregation.

Supported networks include:
    - Ethereum Mainnet
    - Polygon
    - Binance Smart Chain
    - Arbitrum
    - Optimism
    - Base
    - Linea
    - Scroll
    - Avalanche
    - Blast

## Configuration

Set the following environment variables:

```env
WALLET_PRIVATE_KEY=your_private_key
ZERO_EX_API_KEY=your_0x_api_key
{chain}_RPC_URL=your_rpc_endpoint
```

## Installation

```bash
pnpm install @elizaos/plugin-0x
```

## Usage

### Basic Integration

```typescript
import { zeroExPlugin } from "@elizaos/plugin-0x";
```

### Example Usage

The plugin supports natural language commands for ETH transfers:

```typescript
"I want to convert 1 ETH to USDC on ethereum chain";
"Give me the quote";
"Execute it";
```

## Available Actions

The plugin provides the following actions:

1. **GET_INDICATIVE_PRICE_0X**: Get indicative prices for token swaps
    - Example: "Get quote for swapping 1 ETH to USDC on Ethereum chain"
    - Example: "Price check for trading 100 USDT to MATIC on Polygon chain"

2. **GET_QUOTE_0X**: Get the quote for the swap. Quote expires in 5mins. (This action is triggered only after user has requested for an indicative price. No need to repeat the buy/sell tokens because the last indicative price will be stored in the memory)
    - Example: "Get quote"

3. **EXECUTE_SWAP_0X**: Execute token swaps. (Action is triggered only after user has gotten a quote)
    - Example: "Execute the swap"

## Security Best Practices

1. **Environment Variables**
    - Never commit private keys to version control
    - Use secure environment variable management
    - Rotate private keys periodically

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Credits

This plugin integrates with:
- [0x Protocol](https://0x.org/)

For more information about 0x capabilities:
- [0x API Documentation](https://0x.org/docs/api)

## License

This plugin is part of the Eliza project. See the main project repository for license information.