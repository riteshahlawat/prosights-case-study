import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

import { env } from "~/env";

const model = new ChatOpenAI({
    model: "gpt-4o",
    openAIApiKey: env.OPENAI_API_KEY,
});

const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a helpful assistant who remembers all details the user shares with you.`,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
]);

const chain = prompt.pipe(model);

const withMessageHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: async (sessionId) => {
        if (messageHistories[sessionId] === undefined) {
            messageHistories[sessionId] = new InMemoryChatMessageHistory();
        }
        return messageHistories[sessionId]!;
    },
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
});

const config = {
    configurable: {
        sessionId: "abc2",
    },
};

export const chatRouter = createTRPCRouter({
    askQuestion: publicProcedure
        .input(z.object({ question: z.string().min(5) }))
        .mutation(async ({ input }) => {
            const message = await withMessageHistory.invoke(
                {
                    input: input.question,
                },
                config,
            );

            return { response: message.content };
        }),
});
