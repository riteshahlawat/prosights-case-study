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
                "relative flex h-full min-h-0 flex-col rounded-md border border-gray-300",
                messageHistory.isLoading && "items-center justify-center",
            )}
        >
            {renderChats()}
            <SessionManagement />
        </div>
    );
}
