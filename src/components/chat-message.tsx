import clsx from "clsx";
import { UpstashDataType } from "~/server/api/routers/chat";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

export default function ChatMessage({
    message,
    index,
    numMessages,
}: {
    message: UpstashDataType;
    index: number;
    numMessages: number;
}) {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (index === numMessages - 1 && divRef.current) {
            divRef.current.scrollIntoView({ behavior: "smooth" });
            console.log(message.data.content.toString());
        }
    }, [index, numMessages]);
    return (
        <div
            className={clsx(
                "mx-2 mt-3 w-fit max-w-[70%] items-center rounded-xl  px-3 py-1.5",
                message.type === "ai" &&
                    "self-start rounded-tl-none bg-blue-100",
                message.type === "human" &&
                    "self-end rounded-tr-none bg-red-100",
            )}
            ref={divRef}
        >
            <Markdown remarkPlugins={[remarkGfm]}>
                {message.data.content.toString()}
            </Markdown>
        </div>
    );
}
