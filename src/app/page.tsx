import ChatInput from "~/components/chat-input";
import ChatWindow from "~/components/chat-window";

export default function Home() {
    return (
        <main className="mx-2 flex h-full flex-col justify-between md:container md:mx-auto ">
            <ChatWindow />
            <ChatInput />
        </main>
    );
}
