"use client";

import { useAtom } from "jotai";
import { RotateCw } from "lucide-react";
import { createId, sessionIdAtom } from "~/app/_state/atoms";
import { api } from "~/trpc/react";

export default function SessionManagement() {
    const [sessionId, setSessionId] = useAtom(sessionIdAtom);

    const utils = api.useUtils();

    const resetSession = async () => {
        const newSessionId = createId();
        localStorage.setItem("sessionId", newSessionId);
        setSessionId(newSessionId);
        await utils.chat.retrieveMessageHistory.invalidate();
    };

    return (
        sessionId !== "" && (
            <div className="absolute right-3 top-0 mr-2 mt-2 flex flex-row items-center rounded  bg-zinc-800 p-1 text-sm text-zinc-50 ">
                <h4 className="font-bold">Session ID:</h4>
                <p className="ml-1 font-light">{sessionId}</p>
                <div
                    className="transitiona ml-1 cursor-pointer rounded border  border-zinc-600 p-1 hover:bg-zinc-700"
                    title="Reset session"
                    onClick={resetSession}
                >
                    <RotateCw className="size-4 " />
                </div>
            </div>
        )
    );
}
