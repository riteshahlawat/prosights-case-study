import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendHorizontal } from "lucide-react";

export default function ChatInput() {
  return (
    <div className="mb-2 flex w-full flex-row justify-between pt-2">
      <Input type="text" placeholder="Ask your question here..." className="" />
      <Button className="ml-2" variant="outline" size="icon">
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  );
}
