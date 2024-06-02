"use client";

import { useAtom } from "jotai";
import { sessionIdAtom } from "~/app/_state/atoms";

export default function SessionManagement() {
    const [sessionId, setSessionId] = useAtom(sessionIdAtom);

    return (
        sessionId !== "" && (
            <div className="absolute top-0 right-0 mr-2 mt-2 flex flex-row text-sm items-center border p-1 rounded border-blue-600">
                <h4 className="font-bold">Session ID:</h4>
                <p className="ml-1 font-light">{sessionId}</p>
            </div>
        )
    );
}
