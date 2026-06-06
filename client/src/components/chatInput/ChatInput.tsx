import { useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { generateComplaint } from "@/api-manager/requestHandler";
import toast from "react-hot-toast";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBottom, setIsBottom] = useState<boolean>(false)


  const handleSend = async () => {
    setLoading(true)
    try {
      if (!message.trim()) return;

      const res = await generateComplaint(message, image)
      if (res.success) {
        toast.success("Complaint generated!");

      }
    } catch (err) {
      toast.error("Unfortunately your complaint not submitted! Try again after sometime");
    } finally {
      setLoading(false)
      setMessage("");
      setImage(null)
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);


    const textarea = textareaRef.current;
    if (!textarea) return;

    if (textarea?.style.height > "60px" && message.trim()) {
      setIsBottom(true)
    } else if (textarea?.style.height === '60px' || !message.trim()) {
      setIsBottom(false)
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className={`flex ${isBottom ? "items-end" : "items-center"} gap-2 rounded-3xl p-2 border border-white/5 dark:bg-white/5 shadow-sm`}>
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
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          placeholder="Describe your issues.."
          onChange={handleChange}
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
