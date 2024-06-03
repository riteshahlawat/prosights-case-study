import clsx from "clsx";
import { UpstashDataType } from "~/server/api/routers/chat";

export default function ChatMessage({ message }: { message: UpstashDataType }) {
    return (
        <div
            className={clsx(
                "px-3 mx-2 w-fit max-w-[70%] py-1.5 rounded-xl  items-center mt-3",
                message.type === "ai" &&
                    "self-start bg-blue-100 rounded-tl-none",
                message.type === "human" &&
                    "self-end rounded-tr-none bg-red-100",
            )}
        >
            <h5>{message.data.content.toString()}</h5>
        </div>
    );
}
