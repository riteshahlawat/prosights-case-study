import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
    RunnableSequence,
    RunnableWithMessageHistory,
} from "@langchain/core/runnables";

import { env } from "~/env";

const model = new ChatOpenAI({
    model: "gpt-4o",
    openAIApiKey: env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a helpful assistant who remembers all details the user shares with you.`,
    ],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
]);

const chain = RunnableSequence.from([prompt, model]);

const chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: async (sessionId) =>
        new UpstashRedisChatMessageHistory({
            sessionId,
            config: {
                url: env.UPSTASH_REDIS_REST_URL,
                token: env.UPSTASH_REDIS_REST_TOKEN,
            },
        }),
    inputMessagesKey: "input",
    historyMessagesKey: "history",
});

export const chatRouter = createTRPCRouter({
    askQuestion: publicProcedure
        .input(
            z.object({
                question: z.string().min(5),
                sessionId: z.string().length(16),
            }),
        )
        .mutation(async ({ input }) => {
            console.log("hello");
            const message = await chainWithHistory.invoke(
                {
                    input: input.question,
                },
                {
                    configurable: {
                        sessionId: input.sessionId,
                    },
                },
            );

            return { response: message.content };
        }),
});
