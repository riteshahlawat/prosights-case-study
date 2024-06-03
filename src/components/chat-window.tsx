"use client";

import clsx from "clsx";
import { useAtomValue } from "jotai";
import { sessionIdAtom } from "~/app/_state/atoms";
import { api } from "~/trpc/react";
import ChatWindowMessages from "./chat-window-messages";
import SessionManagement from "./session-management";
import { Spinner } from "./ui/spinner";

export default function ChatWindow() {
    const sessionId = useAtomValue(sessionIdAtom);
    const messageHistory = api.chat.retrieveMessageHistory.useQuery({
        sessionId,
    });

    const renderChats = () => {
        if (messageHistory.isLoading) {
            return <Spinner />;
        }

        return <ChatWindowMessages />;
    };

    return (
        <div
            className={clsx(
                "flex h-full min-h-0 flex-col border border-gray-100 rounded-md relative",
                messageHistory.isLoading && "justify-center items-center",
            )}
        >
            {renderChats()}
            <SessionManagement />
        </div>
    );
}
