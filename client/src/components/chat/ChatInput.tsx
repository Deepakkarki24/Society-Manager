import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, XIcon } from "lucide-react";
import { generateComplaint } from "@/api-manager/requestHandler";
import toast from "react-hot-toast";
import { fileToBase64 } from "@/utils/utils";
import { SpinnerGapIcon } from "@phosphor-icons/react";

interface ChatInputInterface {
  currentSessionId: string | null
}

const ChatInput: React.FC<ChatInputInterface> = ({ currentSessionId }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBottom, setIsBottom] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState("")

  const handleSend = async () => {
    setIsLoading(true)
    try {
      if (!message.trim() || !currentSessionId) return;

      const res = await generateComplaint(message, image, currentSessionId)
      if (res.success) {
        toast.success("Complaint generated!");
      } else if (!res.success) {
        toast.error("Unfortunately your complaint not submitted! Try again after sometime!");
      }
    } catch (err) {
      toast.error("Unfortunately your complaint not submitted! Try again after sometime");
      console.log("failed in catch block")
    } finally {
      setIsLoading(false)
      setMessage("");
      setImage(null)
      setPreviewImage("")
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

  const setPreviewFile = async (file: File) => {
    if (file) {
      const result = await fileToBase64(file)

      if (result) {
        setPreviewImage(result)
      }
    }
  }

  useEffect(() => {
    if (image) {
      setPreviewFile(image)
    }
  }, [image])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {previewImage &&
        <div className="absolute -top-25 left-2 w-22 aspect-square rounded-lg overflow-hidden">
          <div className="relative w-full h-full bg-red-600">
            <img src={previewImage} alt="preview Image" className="object-cover w-full h-full" />
            <XIcon onClick={() => setPreviewImage("")} className="text-white cursor-pointer absolute top-0 right-1" size={18} />
          </div>
        </div>
      }
      <div className={`flex ${isBottom ? "items-end" : "items-center"} gap-2 rounded-3xl p-2 border border-white/5 dark:bg-gray-900 shadow-sm`}>
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
          {
            !isloading ? <Send size={18} /> :
              <SpinnerGapIcon size={18} className="animate-spin transition-all ease-in" />
          }
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
