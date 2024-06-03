"use client";

import { useAtomValue } from "jotai";
import { Loader2, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sessionIdAtom } from "~/app/_state/atoms";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export default function ChatInput() {
    const [question, setQuestion] = useState("");
    const sessionId = useAtomValue(sessionIdAtom);

    const utils = api.useUtils();

    const askQuestionMutation = api.chat.askQuestion.useMutation({
        onError(error) {
            toast.error(error.message);
        },

        onSettled: async () => {
            await utils.chat.retrieveMessageHistory.invalidate();
            setQuestion("");
        },
    });

    const askQuestion = () => {
        askQuestionMutation.mutate({ question, sessionId });
    };

    const renderSendIcon = () => {
        if (askQuestionMutation.isPending) {
            return <Loader2 className="size-4 animate-spin" />;
        }
        return <SendHorizontal className="size-4" onClick={askQuestion} />;
    };

    const onEnter = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
    ) => {
        if (e.key === "Enter") {
            askQuestion();
        }
    };
    return (
        <div className="mb-2 flex w-full flex-row justify-between pt-2">
            <Input
                type="text"
                disabled={askQuestionMutation.isPending}
                placeholder="Ask your question here..."
                onKeyDown={onEnter}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
                className="ml-2"
                variant="outline"
                size="icon"
                onKeyDown={onEnter}
                disabled={askQuestionMutation.isPending}
            >
                {renderSendIcon()}
            </Button>
        </div>
    );
}
