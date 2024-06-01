"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendHorizontal } from "lucide-react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function ChatInput() {
    const [question, setQuestion] = useState("");
    const askQuestionMutation = api.chat.askQuestion.useMutation({
        onError(error) {
            toast.error(error.message);
        },

        onSuccess: (data) => {
            console.log(data.response);
        },
    });

    const askQuestion = () => {
        askQuestionMutation.mutate({ question });
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
