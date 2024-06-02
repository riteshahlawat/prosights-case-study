"use client";

import { useAtomValue } from "jotai";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sessionIdAtom } from "~/app/_state/atoms";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export default function ChatInput() {
    const [question, setQuestion] = useState("");
    const sessionId = useAtomValue(sessionIdAtom);

    const askQuestionMutation = api.chat.askQuestion.useMutation({
        onError(error) {
            toast.error(error.message);
        },

        onSuccess: (data) => {
            console.log(data.response);
        },
    });

    const askQuestion = () => {
        askQuestionMutation.mutate({ question, sessionId });
    };

    return (
        <div className="mb-2 flex w-full flex-row justify-between pt-2">
            <Input
                type="text"
                placeholder="Ask your question here..."
                className=""
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <Button className="ml-2" variant="outline" size="icon">
                <SendHorizontal className="size-4" onClick={askQuestion} />
            </Button>
        </div>
    );
}
