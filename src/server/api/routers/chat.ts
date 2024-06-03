import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { AIMessage, BaseMessage } from "@langchain/core/messages";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Redis } from "@upstash/redis";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatDocumentsAsString } from "langchain/util/document";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
    RunnableSequence,
    RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { z } from "zod";
import { env } from "~/env";
import { initialAIMessageContent } from "~/lib/constants";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Pinecone } from "@pinecone-database/pinecone";

import { PineconeStore } from "@langchain/pinecone";

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);

const model = new ChatOpenAI({
    model: "gpt-4o",
    openAIApiKey: env.OPENAI_API_KEY,
});

// const baseCompressor = LLMChainExtractor.fromLLM(model);
// const retriever = new ContextualCompressionRetriever({
//     baseCompressor,
//     baseRetriever: vectorStore.asRetriever(),
// });

const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

export type UpstashDataType = {
    type: "human" | "ai";
    data: BaseMessage;
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
            const vectorStore = await PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings(),
                { pineconeIndex },
            );

            const results = await vectorStore.maxMarginalRelevanceSearch(
                input.question,
                {
                    k: 5,
                    fetchK: 20,
                },
            );

            // console.log({ results });
            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    `You are a helpful assistant who will help the user with any information they want regarding the company Bumble. You will answer the user's questions based on the following context. While also taking into account previous chat history:
                    ==============================
                    Context: {context}
                    ==============================
                    History: {history}
                    ==============================
                    .`,
                ],
                ["human", "{input}"],
            ]);

            const chain = RunnableSequence.from([
                {
                    input: (input) => input.input,
                    history: (input) => input.history,
                    context: () => formatDocumentsAsString(results),
                },
                prompt,
                model,
            ]);

            const chainWithHistory = new RunnableWithMessageHistory({
                runnable: chain,
                getMessageHistory: async (sessionId: string) => {
                    const history = new UpstashRedisChatMessageHistory({
                        sessionId,
                        config: {
                            url: env.UPSTASH_REDIS_REST_URL,
                            token: env.UPSTASH_REDIS_REST_TOKEN,
                        },
                    });

                    const messages = await history.getMessages();

                    if (messages.length === 0) {
                        await history.addMessage(
                            new AIMessage(initialAIMessageContent),
                        );
                    }
                    return history;
                },
                inputMessagesKey: "input",
                historyMessagesKey: "history",
            });

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
