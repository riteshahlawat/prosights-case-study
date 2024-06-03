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
                "mx-2 mt-3 w-fit max-w-[70%] items-center px-3 py-1.5 text-sm  lg:text-base ",
                message.type === "ai" &&
                    "self-start rounded-tl-none bg-blue-100",
                message.type === "human" &&
                    "self-end rounded-tr-none bg-red-100",
            )}
            ref={divRef}
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    li: (props) => {
                        const { children, className, node, ...rest } = props;
                        return (
                            <li className={clsx(className, "ml-4")} {...rest}>
                                {children}
                            </li>
                        );
                    },
                    ol: (props) => {
                        const { children, className, node, ...rest } = props;
                        return (
                            <ol
                                className={clsx(className, "my-2 list-decimal")}
                                {...rest}
                            >
                                {children}
                            </ol>
                        );
                    },
                }}
            >
                {message.data.content.toString()}
            </Markdown>
        </div>
    );
}
