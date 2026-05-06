import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Hash, Plus, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";

const JoinCreateChat = ({ closeModal }) => {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const userName = localStorage.getItem("loginUserName");

  const handleAction = async (type) => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    
    setLoading(true);
    try {
      const endpoint = type === 'create' ? 'create-room' : 'join-room';
      const response = await axios.post(`${API_BASE_URL}/chat-room/${endpoint}/${userName}`, {
        roomId: roomName,
      });

      if (response.status === 200) {
        toast.success(type === 'create' ? "Room created!" : "Joined room!");
        closeModal();
        window.location.reload(); // Refresh to show new room
      }
    } catch (error) {
      toast.error(error.response?.data || `${type === 'create' ? 'Creation' : 'Joining'} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">New Conversation</h2>
            <p className="text-sm text-slate-400">Start a new chat or join an existing one</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Room ID / Name</label>
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. project-awesome"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('create')}
              disabled={loading}
              className="py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Create
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction('join')}
              disabled={loading}
              className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-white/5 flex items-center justify-center gap-2"
            >
              Join <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-600/5 p-4 text-center">
        <p className="text-[10px] text-indigo-400/60 uppercase tracking-widest font-bold">
          End-to-end encrypted
        </p>
      </div>
    </div>
  );
};

export default JoinCreateChat;
