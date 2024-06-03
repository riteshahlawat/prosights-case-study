import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { readdir } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from "path";

import { env } from "~/env";

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);

/**
 * Function is called once, never again.
 */
const loadDocsFromFileSystem = async () => {
    const files = await readdir(process.cwd() + "/public/knowledge_base");
    const docs: Document<Record<string, string>>[] = [];
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    for (const file of files) {
        const filePathString = process.cwd() + "/public/knowledge_base/" + file;
        const filePath = path.parse(filePathString);
        if (filePath.ext === ".pdf") {
            const loader = new PDFLoader(filePathString);
            const loadedDocs = await loader.load();
            for (const loadedDoc of loadedDocs) {
                const doc = new Document({
                    pageContent: loadedDoc.pageContent,
                    metadata: {
                        filePathString,
                    },
                });
                docs.push(doc);
            }
        }
    }

    const splits = await textSplitter.splitDocuments(docs);

    console.log("Indexing " + splits.length + " documents...");

    for (const doc of splits) {
        await PineconeStore.fromDocuments([doc], new OpenAIEmbeddings(), {
            pineconeIndex,
            maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
        });
    }
};
