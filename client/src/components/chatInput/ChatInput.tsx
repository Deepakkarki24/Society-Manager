import { useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("Message:", message);
    setMessage("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 rounded-3xl px-2 border border-white/5 bg-white/5 shadow-sm">
        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition"
        >
          <Paperclip size={20} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Textarea */}
        <textarea
          rows={1}
          value={message}
          placeholder="Describe your issues.."
          onChange={(e) => setMessage(e.target.value)}
          className="max-h-40 flex-1 py-4 resize-none bg-transparent outline-none text-lg"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
