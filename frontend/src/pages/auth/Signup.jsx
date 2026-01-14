import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import apiClient from "../../api/apiClient";
import logo from "../../assets/churchly-logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "email") {
      setEmailExists(false);
    }
  };

  const checkEmailExists = async (email) => {
    if (!email) return;
    try {
      const response = await apiClient.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      setEmailExists(response.data.exists);
    } catch (err) {
      setEmailExists(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await apiClient.post("/auth/signup", {
        full_name: form.name || "",
        email: form.email || "",
        password: form.password || "",
        parish_id: null
      });

      // Navigate to email verification page with email in state
      navigate("/auth/verify-email", { state: { email: form.email } });
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "Signup failed. Please try again.";

      if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(e => typeof e === 'object' && typeof e.msg === 'string' ? e.msg : JSON.stringify(e)).join(', ');
        } else if (typeof errorData.detail === 'object' && typeof errorData.detail.msg === 'string') {
          errorMessage = errorData.detail.msg;
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7efe6] dark:bg-[#121212]">
      <form onSubmit={handleSignup} className="bg-white dark:bg-[#181818] px-8 pt-4 pb-8 rounded-xl w-96 shadow-lg">

        <div className="flex justify-center mb-8 mt-8">
          <img src={logo} alt="Churchly Logo" className="w-36 h-36" />
        </div>

        <h2 className="text-2xl font-bold mb-8 text-center text-[#3b2a20] dark:text-[#B3B3B3]">Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#181818] text-[#3b2a20] dark:text-white"
          value={form.name}
          onChange={(e) => updateForm("name", e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#181818] text-[#3b2a20] dark:text-white"
          value={form.email}
          onChange={(e) => updateForm("email", e.target.value)}
          onBlur={(e) => checkEmailExists(e.target.value)}
        />
        {emailExists && <p className="text-red-600 mb-4 text-center">Email already registered</p>}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#181818] text-[#3b2a20] dark:text-white"
            value={form.password}
            onChange={(e) => updateForm("password", e.target.value)}
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

        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#181818] text-[#3b2a20] dark:text-white"
            value={form.confirmPassword}
            onChange={(e) => updateForm("confirmPassword", e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-4"
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color="#6b4a2d" />
            ) : (
              <Eye size={20} color="#6b4a2d" />
            )}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <button className="w-full bg-[#6b4a2d] text-white py-4 rounded-xl hover:bg-[#5b3f2c] transition">
          Sign Up
        </button>

        <div className="mt-8 text-center text-[#3b2a20] dark:text-[#B3B3B3]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="text-[#6b4a2d] font-semibold"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
