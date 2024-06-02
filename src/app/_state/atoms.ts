import { init } from "@paralleldrive/cuid2";
import "client-only";
import { atom } from "jotai";

const createId = init({
    random: Math.random,
    length: 16,
});

let storedSessionId;

if (typeof window !== "undefined") {
    storedSessionId = localStorage.getItem("sessionId");
}

if (!storedSessionId) {
    storedSessionId = createId();
    if (typeof window !== "undefined") {
        localStorage.setItem("sessionId", storedSessionId);
    }
}

export const sessionIdAtom = atom(storedSessionId);
