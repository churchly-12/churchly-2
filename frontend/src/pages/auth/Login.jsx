import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";
import logo from "../../assets/churchly-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password: password
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
      );

      await login(response.data.access_token);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe6] dark:bg-[#121212]">
      <form onSubmit={handleLogin} className="bg-white dark:bg-[#181818] px-8 pt-4 pb-8 rounded-xl w-96 shadow-lg">

        <div className="flex justify-center mb-8 mt-8">
          <img src={logo} alt="Churchly Logo" className="w-36 h-36" />
        </div>

        <h2 className="text-2xl font-bold mb-8 text-center text-[#3b2a20] dark:text-[#B3B3B3]">Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#181818] text-[#3b2a20] dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#181818] text-[#3b2a20] dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4"
          >
            {showPassword ? (
              <EyeOff size={20} color="#6b4a2d" />
            ) : (
              <Eye size={20} color="#6b4a2d" />
            )}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <button className="w-full bg-[#6b4a2d] text-white py-4 rounded-xl hover:bg-[#5b3f2c] transition">
          Login
        </button>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/auth/admin-login")}
            className="flex items-center space-x-1 text-[#6b4a2d] hover:text-[#5b3f2c] transition font-semibold"
          >
            <Shield size={16} />
            <span>Admin Portal</span>
          </button>
        </div>

        <button
          type="button"
          className="w-full mt-4 text-blue-600 text-center"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot Password?
        </button>

        <div className="mt-8 text-center text-[#3b2a20] dark:text-[#B3B3B3]">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="text-[#6b4a2d] font-semibold"
          >
            Sign up
          </button>
        </div>

      </form>
    </div>
  );
}
