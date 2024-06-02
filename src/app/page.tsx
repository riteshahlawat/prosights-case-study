import ChatInput from "~/components/chat-input";
import ChatWindow from "~/components/chat-window";

export default function Home() {
    return (
        <main className="container flex h-full flex-col justify-between ">
            <ChatWindow />
            <ChatInput />
        </main>
    );
}
