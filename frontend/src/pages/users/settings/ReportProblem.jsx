import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportProblem() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState("");

  const handleSend = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold">Report a Problem</h1>
      </div>

      <textarea
        className="w-full p-4 bg-white border rounded-2xl h-40 shadow-md"
        placeholder="Explain the issue you're facing..."
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
      ></textarea>

      <button
        onClick={handleSend}
        className="mt-5 w-full bg-[#6b4a2d] text-white p-3 rounded-xl"
      >
        Submit
      </button>

    </div>
  );
}