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


export const startGame: Action = {
    name: "START_GAME",
    similes: ["Почати гру", "Я хочу пограти", "Старт гри"],
    description:
        "Запускає гру, де користувач може грати в інтерактивну гру з агентом.",
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Старт гри" },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Я бачу ти хочеш пограти в гру. Давай почнемо!",
                    action: "START_GAME",
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
        const context = composeContext({ state, template: gameTemplate });

        const extractedData = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.LARGE,
        });

        callback({
            text: "Я бачу ти хочеш пограти в гру. Давай почнемо!",
        });
    },
};

const gameTemplate = `
Ви - майстер гри, який створює історію для гри в чаті. Я - користувач, якому потрібно "пограти" у вашу гру. 
Вам потрібно описати світ, лор, мого персонажа та кроки для гри. 
Ви повинні запитувати мене про мої дії на кожному кроці, і дії вплинуть на мій прогрес і кінцевий рахунок. повинен мати правильне рішення, але навіть з неправильним я можу прийти до чогось. 
У результаті я мав би отримати балів зі 100 за те, наскільки правильно я пройшов порівняно оригінальну історію. 
Важливо замінити, що деякі кроки можуть бути критичними і негайно завершити гру. 
Наприклад, прямо скажу, що замість того, щоб вбити дракона, я вбиваю себе. 
Продумайте кроки і завдання навколо оригінальної історії, тому що в кінцевому підсумку користувач повинен отримати історію і зрозуміти, де він помилився.`;
