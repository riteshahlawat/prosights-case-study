import Link from "next/link";
import ChatInput from "~/components/chat-input";
import ChatWindow from "~/components/chat-window";

import { CreatePost } from "~/components/create-post";
import { api } from "~/trpc/server";

export default async function Home() {
  return (
    <main className="container flex h-full flex-col justify-between ">
      <ChatWindow />
      <ChatInput />
    </main>
  );
}
