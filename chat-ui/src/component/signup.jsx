import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import API_BASE_URL from "../config";

const Signup = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!userData.userName || !userData.email || !userData.password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, userData);
      if (response.data) {
        toast.success("Account created! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ rotate: -12 }}
            animate={{ rotate: 0 }}
            className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-indigo-600/20"
          >
            <UserPlus size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join the best chat community</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl border border-white/10">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  name="userName"
                  value={userData.userName}
                  onChange={handleInput}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  name="email"
                  value={userData.email}
                  onChange={handleInput}
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
                  name="password"
                  value={userData.password}
                  onChange={handleInput}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
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
                <>Get Started <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
