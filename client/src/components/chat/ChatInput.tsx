import { useEffect, useRef, useState } from "react";
import { CheckIcon, Paperclip, Send, XIcon } from "lucide-react";
import { generateComplaint } from "@/api-manager/requestHandler";
import toast from "react-hot-toast";
import { fileToBase64 } from "@/utils/utils";
import { CaretDownIcon, CaretUpIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";

interface ChatInputInterface {
  currentSessionId: string | null
  fecthSessions: () => void
  fetchCurrentSessionChats: (params: { sessionId: string; }) => void
}

type CHAT_MODE = "complaint" | "details"

interface ChatModeInterface {
  type: CHAT_MODE,
  label: string
}

const CHAT_MODES: ChatModeInterface[] = [
  {
    type: "complaint",
    label: "Complaint"
  },
  {
    type: "details",
    label: "Details"
  }
]


const ChatInput: React.FC<ChatInputInterface> = ({ currentSessionId, fecthSessions, fetchCurrentSessionChats }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBottom, setIsBottom] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState("")

  const [chatMode, setChatMode] = useState<CHAT_MODE>("complaint")
  const [showChatModeDropdown, setShowChatModeDropdown] = useState<boolean>(false)


  const handleSend = async () => {
    setIsLoading(true)
    try {
      if (!message.trim() || !currentSessionId) return;

      const res = await generateComplaint(message, image, currentSessionId)
      if (res.success) {
        toast.success("Complaint generated!");
        fecthSessions()
        fetchCurrentSessionChats({ sessionId: currentSessionId })
      } else if (!res.success) {
        if (!res.error.isComplaint) {
          toast.error(res?.message as string);
        } else {
          toast.error("Unfortunately your complaint not submitted! Try again after sometime!");
        }
      }
    } catch (err) {
      console.log(err)
      toast.error("Unfortunately your complaint not submitted! Try again after sometime");
      console.log("failed in catch block")
    } finally {
      setIsLoading(false)
      setMessage("");
      setImage(null)
      setPreviewImage("")
    }
  };

  const placeholder =
    chatMode === "complaint"
      ? window.innerWidth < 640
        ? "Describe your issue..."
        : "Describe your issue (e.g., water leakage, maintenance, security, etc.)"
      : window.innerWidth < 640
        ? "Ask about society rules..."
        : "Ask anything about society rules, facilities, notices, or regulations...";

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
    <div className="relative w-full max-w-4xl mx-auto max-sm:mb-2">
      {previewImage &&
        <div className="absolute -top-25 left-2 w-22 aspect-square rounded-lg overflow-hidden">
          <div className="relative w-full h-full ring-2 ring-primary-400/30 rounded-lg">
            <img
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              src={previewImage}
              alt="preview Image"
              className="object-cover w-full h-full" />
            <Tooltip>
              <TooltipTrigger asChild>
                <XIcon onClick={() => setPreviewImage("")} className="text-white cursor-pointer absolute top-1 right-1 bg-red-500/80 rounded-full p-0.5" size={18} />
              </TooltipTrigger>
              <TooltipContent>
                Remove
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      }
      <div className={`flex ${isBottom ? "items-end" : "items-center"} gap-2 rounded-2xl p-2 bg-[#1F1F1F]`}>
        {/* Upload Button */}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary transition hover:bg-white/10 hover:text-primary-400 cursor-pointer"
            >
              <Paperclip size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent dir="top">
            Upload an image
          </TooltipContent>
        </Tooltip>
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
          placeholder={placeholder}
          onChange={handleChange}
          className="sm:max-h-40 max-h-30 flex-1 py-3 resize-none bg-transparent outline-none sm:text-base text-xs text-text-primary placeholder:text-white/50"
        />

        {/*chat mode*/}
        <Tooltip>
          <TooltipTrigger>
            <button
              onClick={() => setShowChatModeDropdown((prev) => !prev)}
              className="sm:p-2 max-sm:w-20 rounded-xl overflow-hidden cursor-pointer hover:bg-white/10">
              <span className="flex gap-1 items-center text-white sm:text-sm text-xs font-stretch-extra-condensed tracking-wider">
                {chatMode.toUpperCase()[0] + chatMode.toLowerCase().slice(1)}
                {!showChatModeDropdown ? <CaretUpIcon size={18} /> :
                  <CaretDownIcon size={18} />}
              </span>
            </button>
            <TooltipContent>
              Chat mode
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>

        {
          showChatModeDropdown &&
          <div className="w-40 absolute bottom-20 right-4 p-2 backdrop-blur-sm bg-white/10 rounded-xl">
            {
              CHAT_MODES.map((m, idx) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setChatMode(m.type)
                        setShowChatModeDropdown(false)
                      }}
                      disabled={m.type === 'details'}
                      key={idx} className="disabled:cursor-not-allowed disabled:opacity-30 w-full flex justify-between items-center hover:bg-white/15 cursor-pointer rounded-xl text-white sm:text-sm text-xs sm:p-2 p-1.5">
                      {m.label}
                      {m.type === chatMode && < CheckIcon size={18} />}
                    </button>
                  </TooltipTrigger>
                  {m.type === 'details' && <TooltipContent direction="left">
                    Coming soon
                  </TooltipContent>}
                </Tooltip>
              ))
            }
          </div>
        }

        {/* chat mode*/}

        {/* Send Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-primary text-white shadow-md shadow-primary-600/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {
                !isloading ? <Send size={18} /> :
                  <SpinnerGapIcon size={18} className="animate-spin transition-all ease-in" />
              }
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Generate
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatInput;
