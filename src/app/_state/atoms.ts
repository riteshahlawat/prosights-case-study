import { init } from "@paralleldrive/cuid2";
import "client-only";
import { atom } from "jotai";

export const createId = init({
    random: Math.random,
    length: 16,
});

let storedSessionId;

if (typeof window !== "undefined") {
    storedSessionId = localStorage.getItem("sessionId");

    if (!storedSessionId) {
        storedSessionId = createId();
        localStorage.setItem("sessionId", storedSessionId);
    }
} else {
    storedSessionId = "";
}

export const sessionIdAtom = atom(storedSessionId);
