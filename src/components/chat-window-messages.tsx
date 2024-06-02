import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { sessionIdAtom } from "~/app/_state/atoms";
import { api } from "~/trpc/react";
import ChatMessage from "./chat-message";

export default function ChatWindowMessages() {
    const sessionId = useAtomValue(sessionIdAtom);
    const messageHistory = api.chat.retrieveMessageHistory.useQuery({
        sessionId,
    });

    const sortedMessageHistory = messageHistory.data
        ?.map((item) => item)
        .reverse();

    useEffect(() => {
        console.log(messageHistory.data);
    }, [messageHistory.data]);

    return (
        <div className="flex flex-col">
            {sortedMessageHistory?.map((message) => (
                <ChatMessage message={message} />
            ))}
        </div>
    );
}
