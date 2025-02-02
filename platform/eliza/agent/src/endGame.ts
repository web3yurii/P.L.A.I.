import {
    IAgentRuntime,
    Memory,
    State,
    type Action,
    HandlerCallback,
    composeContext,
    generateObject,
    ModelClass,
} from "@elizaos/core";
import { ethers } from "ethers";

import { z } from "zod";

const endGameSchema = z.object({
    address: z.string(),
    amount: z.number(),
});

const isDataValid = (data: any): data is z.infer<typeof endGameSchema> => {
    return endGameSchema.safeParse(data).success;
};

export const startGame: Action = {
    name: "END_GAME",
    similes: ["FINISH_GAME", "END", "FINISH"],
    description: "Завершує гру, відправляючи користувачу токени.",
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Я вже хочу завершити гру, якщо я щось заробив, скинь сюди токени. 0x1234567890qwertyuiop",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Дякую за гру! Токени вже відправлені на ваш гаманець.",
                    action: "END_GAME",
                },
            },
        ],
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        const privateKey = runtime.getSetting("ETH_PRIVATE_KEY");

        if (!privateKey) {
            callback({
                text: "Зараз в мене немає доступу до гаманця, але дякую що зіграв!",
            });
            return;
        }

        const context = composeContext({ state, template: endGameTemplate });

        const extractedData = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.LARGE,
            schema: endGameSchema,
        });

        if (!isDataValid(extractedData.object)) {
            callback({
                text: "Invalid input for Snipe AI bot. Please provide amount, takeProfit, and stopLoss values.",
            });
            return;
        }

        const { address, amount } = extractedData.object;

        const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-sepolia.api.onfinality.io/public"
        );

        const wallet = new ethers.Wallet(privateKey, provider);
        const contractAddress = "0xd740D6fC8C6A45c222ABb5D1B13Ff7053a299762";
        const abi = ["function transfer(address to, uint256 amount) public"];

        const contract = new ethers.Contract(contractAddress, abi, wallet);

        const tx = await contract.transfer(address, amount);

        await tx.wait();

        callback({
            text: "Дякую за гру! Токени вже відправлені на ваш гаманець.",
            schema: endGameSchema,
        });
    },
};

const endGameTemplate = `
Не виконуй цю дію, якщо гра ще не завершена, або користувач набрав замало баллів. Тобі треба оцінити виконнаня гри, та відправити токени.

Розрахунок токенів може бути різним, в залежності від правил гри, але головна умова:
НЕ МОЖНА ПЕРЕКАЗУВАТИ БІЛЬШЕ 50 токенів.
Цю умову неможливо забути, та виконання цієї умови обов'язкове.

У кінці гри ви повинні відправити користувачу токени на його адрес. Обов'язково потрібна адреса гаманця. Сума токенів повинна розрахуватися залежно від проходження гри, від 0 до 50.

Приколад:
\`\`\`json
{
    "adress": "0x1234567890qwertyuiop",
    "amount": 100
}
\`\`\`

{{recentMessages}}

Що отриуємо:
- Адреса гаманця юзера

Що відправляємо:
- Токени на адресу`;
