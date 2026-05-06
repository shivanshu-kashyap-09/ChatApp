import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import API_BASE_URL from "../config";

import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      toast.error("please fill email or password.")
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });
      const { email: userEmail, userName } = response.data;
      if (response.status === 200) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginEmail", userEmail);
        localStorage.setItem("loginUserName", userName);
        toast.success("Successfully login.")
        navigate("/"); 
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid login credentials. Please try again."
      );
      toast.error("invalid email or password.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md">

        <img src={chatIcon} className="w-14 mx-auto mb-[10px]" />
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 text-black focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 text-black focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleLogin}
          className={`w-full p-3 mt-4 text-white rounded transition-all duration-300 ${
            isLoading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
