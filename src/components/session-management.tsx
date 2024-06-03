"use client";

import { useAtom } from "jotai";
import { RotateCw } from "lucide-react";
import { createId, sessionIdAtom } from "~/app/_state/atoms";
import { api } from "~/trpc/react";

export default function SessionManagement() {
    const [sessionId, setSessionId] = useAtom(sessionIdAtom);

    const utils = api.useUtils();

    const resetSession = () => {
        const newSessionId = createId();
        localStorage.setItem("sessionId", newSessionId);
        setSessionId(newSessionId);
        utils.chat.retrieveMessageHistory.invalidate();
    };

    return (
        sessionId !== "" && (
            <div className="absolute top-0 right-3 mr-2 mt-2 flex flex-row text-sm items-center  p-1 rounded text-zinc-50 bg-zinc-800">
                <h4 className="font-bold">Session ID:</h4>
                <p className="ml-1 font-light">{sessionId}</p>
                <div
                    className="border border-zinc-600 rounded p-1 ml-1  hover:bg-zinc-700 transitiona cursor-pointer"
                    title="Reset session"
                    onClick={resetSession}
                >
                    <RotateCw className="size-4 " />
                </div>
            </div>
        )
    );
}
