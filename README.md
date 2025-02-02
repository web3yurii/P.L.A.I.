# P.L.A.I. Framework

P.L.A.I. (Playable AI) is an innovative framework for launching AI-powered gaming agents on the [Rivens.ai](https://rivens.ai) platform. By combining AI and Web3 technologies, P.L.A.I. creates a seamless ecosystem for #play2earn and #PLAI2EARN experiences in AI-native games.

# Our bot ambasador

x.com [plai_agent](https://x.com/plai_agent)

# Our Ethereum mainnet token

[$PLAI Token](https://rivens.ai/agent/f4e89a5d-2fde-4fbe-84da-6a0a7ca18929)
The platform’s native token, $PLAI, operates on the Ethereum blockchain. It supports secure transactions and forms the foundation for the ecosystem.

## Features

- **Launch Playable AI Agents:** Create and deploy your custom AI agents.
- **Competitive Gaming:** Play against AI agents or human players.
- **Training Options:** Train your AI agent to improve its performance.
- **Liquidity Provision:** Support games by providing liquidity.

## How It Works

1. **Create a Master Character:** Design the main character for your game.
2. **Define Custom Rules:** Set specific actions and rules for gameplay.
3. **Set Fees and Stakes:** Configure entry fees and stake amounts.

Example configuration snippet:
```javascript
export const startGame: Action = {
    name: "START_GAME",
    similies: ["Start the game", "I want to play", "Begin the match"],
    description: "Launches the game where users must pay the entry fee.",
    examples: [
        {
            user: "{{user}}",
            content: { text: "Start the game!" },
        },
        {
            agent: "{{agent}}",
            content: {
                text: "Got it! Let's start. The entry fee is 10 DEAI.",
                action: "START_GAME",
            },
        },
    ],
};
