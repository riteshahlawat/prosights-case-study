import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { ChatMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { Redis } from "@upstash/redis";
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

const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
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
    getMessageHistory: async (sessionId: string) =>
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

export type UpstashDataType = {
    type: "human" | "ai";
    data: ChatMessage;
};

export const chatRouter = createTRPCRouter({
    askQuestion: publicProcedure
        .input(
            z.object({
                question: z.string().min(5),
                sessionId: z.string().length(16),
            }),
        )
        .mutation(async ({ input }) => {
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

    retrieveMessageHistory: publicProcedure
        .input(
            z.object({
                sessionId: z.string().length(16),
            }),
        )
        .query(async ({ input }) => {
            const messageHistoryUpstash: UpstashDataType[] = await redis.lrange(
                input.sessionId,
                0,
                -1,
            );

            return messageHistoryUpstash;
        }),
});
