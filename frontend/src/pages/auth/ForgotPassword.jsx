import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe6]">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#3b2a20]">
          Reset Password
        </h2>

        {sent ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Reset link sent to your email
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-[#6b4a2d] text-white py-3 rounded-xl hover:bg-[#5b3f2c] transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-4 border border-gray-300 rounded-xl bg-white text-[#3b2a20]"
              required
            />

            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition mb-4"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-[#6b4a2d] text-center"
            >
              Back to Login
            </button>
          </>
        )}
      </form>
    </div>
  );
}