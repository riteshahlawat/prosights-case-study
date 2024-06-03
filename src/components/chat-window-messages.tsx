import { AIMessage } from "@langchain/core/messages";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { sessionIdAtom } from "~/app/_state/atoms";
import { initialAIMessageContent } from "~/lib/constants";
import { UpstashDataType } from "~/server/api/routers/chat";
import { api } from "~/trpc/react";
import ChatMessage from "./chat-message";

export default function ChatWindowMessages() {
    const sessionId = useAtomValue(sessionIdAtom);
    const messageHistory = api.chat.retrieveMessageHistory.useQuery({
        sessionId,
    });

    const [sortedMessageHistory, setSortedMessageHistory] = useState<
        UpstashDataType[]
    >([]);

    useEffect(() => {
        if (messageHistory.data) {
            if (messageHistory.data.length >= 1) {
                setSortedMessageHistory(
                    messageHistory.data.map((item) => item).reverse(),
                );
            } else {
                // Add initial AI message manually
                setSortedMessageHistory([
                    {
                        type: "ai",
                        data: new AIMessage(initialAIMessageContent),
                    },
                ]);
            }
        }
    }, [messageHistory.data]);

    return (
        <div className="flex flex-col overflow-y-auto pb-3 pt-10 md:pt-0">
            {sortedMessageHistory?.map((message, i) => (
                <ChatMessage
                    key={i}
                    message={message}
                    index={i}
                    numMessages={sortedMessageHistory.length}
                />
            ))}
        </div>
    );
}
