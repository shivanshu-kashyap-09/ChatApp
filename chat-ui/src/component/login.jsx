import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Mail, Lock, LogIn, Github, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import API_BASE_URL from "../config";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (response.data) {
        localStorage.setItem("loginEmail", response.data.email);
        localStorage.setItem("loginUserName", response.data.userName);
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Welcome back!");
        navigate("/chat");
      }
    } catch (error) {
      toast.error(error.response?.data || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send token to backend for verification
      const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential
      });
      
      if (response.data) {
        localStorage.setItem("loginEmail", response.data.email);
        localStorage.setItem("loginUserName", response.data.userName);
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Logged in with Google!");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-indigo-600/20 rotate-12"
          >
            <LogIn size={40} className="text-white -rotate-12" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue chatting</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</a>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                ${loading ? "bg-indigo-600/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"}
              `}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <LogIn size={20} /></>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-950 px-4 text-slate-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                theme="filled_black"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
