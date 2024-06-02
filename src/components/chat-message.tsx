import { UpstashDataType } from "~/server/api/routers/chat";

export default function ChatMessage({ message }: { message: UpstashDataType }) {
    return <div>{message.data.content.toString()}</div>;
}
