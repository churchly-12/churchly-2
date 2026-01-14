import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactSupport() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold">Contact Support</h1>
      </div>

      <textarea
        className="w-full p-4 bg-white border rounded-2xl h-40 shadow-md"
        placeholder="Describe your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <button
        onClick={handleSend}
        className="mt-5 w-full bg-[#6b4a2d] text-white p-3 rounded-xl"
      >
        Send Message
      </button>
    </div>
  );
}