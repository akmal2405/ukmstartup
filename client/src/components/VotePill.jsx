import { ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";

export default function VotePill() {
  return (
    <div className="flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1">
      <div className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <ArrowBigUp className="w-4 h-4 text-gray-600" />
      </div>

      <span className="text-sm font-semibold text-gray-800 min-w-[32px] text-center">
        803
      </span>

      <div className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <ArrowBigDown className="w-4 h-4 text-gray-600" />
      </div>

      <div className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <MessageCircle className="w-4 h-4 text-gray-600" />
      </div>

    </div>

  );
}

<MessageCircle />