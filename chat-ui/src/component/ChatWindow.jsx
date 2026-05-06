import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { 
  Plus, 
  Send, 
  Paperclip, 
  LogOut, 
  Menu, 
  X, 
  MessageSquare, 
  Settings, 
  User,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
  File as FileIcon,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import JoinCreateChat from "./JoinCreateChat";
import axios from "axios";
import { timeAgo } from "../Config/Helper";
import API_BASE_URL from "../config";
import { subscribeToNotifications } from "../Config/notification";

const ChatWindow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(localStorage.getItem("loginEmail"));
  const [showRooms, setShowRooms] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const stompClientRef = useRef(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem("loginUserName");

  // Handle logout
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }
    setConnected(false);
    toast.success("Logged out successfully");
    localStorage.clear();
    navigate("/login");
  };

  // Fetch rooms on load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const email = localStorage.getItem("loginEmail");
        const response = await axios.get(`${API_BASE_URL}/chat-room/room-list/${email}`);
        setRooms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  // Subscribe to push notifications
  useEffect(() => {
    if (currentUserEmail) {
      subscribeToNotifications();
    }
  }, [currentUserEmail]);

  // Fetch messages when a room is selected
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/chat-room/message/${selectedRoom.roomId}`);
          setMessages(response.data || []);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
      
      // Connect to WebSocket for this room
      connectWebSocket(selectedRoom.roomId);
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [selectedRoom]);

  const connectWebSocket = (roomId) => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }

    const client = Stomp.over(() => new SockJS(`${API_BASE_URL}/chat`));
    client.debug = () => {}; 
    
    client.connect({}, () => {
      stompClientRef.current = client;
      setConnected(true);
      
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        try {
          const receivedMsg = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMsg]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });
    }, (err) => {
      console.error("WebSocket connection error:", err);
      toast.error("Connection lost. Retrying...");
    });
  };

  // Scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (fileData = null) => {
    if (stompClientRef.current && (newMessage.trim() || fileData)) {
      const message = {
        sender: userName,
        content: newMessage,
        roomId: selectedRoom.roomId,
        sendTime: new Date().toISOString(),
        fileUrl: fileData?.url || null,
        fileName: fileData?.name || null,
        fileType: fileData?.type || null
      };
      stompClientRef.current.send(
        `/app/sendMessage/${selectedRoom.roomId}`,
        {},
        JSON.stringify(message)
      );
      setNewMessage("");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      sendMessage(response.data);
      toast.success("File sent!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar - Rooms List */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !selectedRoom) && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed inset-0 z-40 w-full sm:relative sm:w-80 md:w-96 
              bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 
              flex flex-col
            `}
          >
            {/* Sidebar Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-lg">
                  {userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-white">{userName}</h2>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-indigo-400"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-20 sm:pb-4">
              {rooms.map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedRoom(room);
                    if (window.innerWidth < 640) setIsSidebarOpen(false);
                  }}
                  className={`
                    p-4 rounded-2xl cursor-pointer flex items-center gap-4 transition-all
                    ${selectedRoom?.roomId === room.roomId 
                      ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" 
                      : "hover:bg-white/5 border border-transparent hover:border-white/5"}
                  `}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold">
                    {room.roomId.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium truncate text-slate-100">{room.roomId}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* User Actions Mobile */}
            <div className="p-4 border-t border-white/5 mt-auto flex items-center justify-around sm:hidden">
              <button onClick={handleLogout} className="p-3 text-red-400 flex items-center gap-2">
                <LogOut size={20}/> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="sm:hidden p-2 text-slate-400"
                >
                  <Menu size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">
                  {selectedRoom.roomId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">{selectedRoom.roomId}</h2>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    {connected ? "Active now" : "Connecting..."}
                  </p>
                </div>
              </div>
              <button 
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
                >
                  <LogOut size={16} /> Logout
                </button>
            </header>

            {/* Messages Area */}
            <main 
              ref={chatBoxRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scroll-smooth"
            >
              {messages.map((message, index) => {
                const isMe = message.sender === userName;
                const isImage = message.fileType?.startsWith("image/");

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={index}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {!isMe && <span className="text-[10px] text-slate-500 ml-2 mb-1">{message.sender}</span>}
                      
                      <div className={`px-4 py-2.5 shadow-xl ${isMe ? "message-bubble-out" : "message-bubble-in"}`}>
                        {/* Text Content */}
                        {message.content && <p className="text-sm leading-relaxed mb-2">{message.content}</p>}
                        
                        {/* File Content */}
                        {message.fileUrl && (
                          <div className="rounded-lg overflow-hidden bg-black/20 p-2 mb-1">
                            {isImage ? (
                              <img src={message.fileUrl} alt={message.fileName} className="max-w-full rounded-md cursor-pointer hover:opacity-90" onClick={() => window.open(message.fileUrl, '_blank')} />
                            ) : (
                              <div className="flex items-center gap-3 p-2">
                                <FileIcon size={24} className="text-indigo-300" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{message.fileName}</p>
                                  <p className="text-[10px] opacity-50 uppercase">{message.fileType?.split('/')[1]}</p>
                                </div>
                                <a href={message.fileUrl} download={message.fileName} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                  <Download size={16} />
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[9px] opacity-50">{timeAgo(message.sendTime)}</span>
                          {isMe && <CheckCheck size={12} className="text-indigo-200" />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </main>

            {/* Input Area */}
            <div className="p-6 bg-slate-950/80 backdrop-blur-md">
              <div className="max-w-4xl mx-auto flex items-end gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-indigo-500/50 transition-all">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={`p-3 transition-colors ${uploading ? "text-indigo-500 animate-pulse" : "text-slate-400 hover:text-indigo-400"}`}
                >
                  <Paperclip size={20} />
                </button>
                <textarea 
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={uploading ? "Uploading file..." : "Type a message..."}
                  disabled={uploading}
                  className="flex-1 bg-transparent border-none focus:outline-none py-3 text-sm text-slate-200 resize-none max-h-32"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  className={`p-3 rounded-xl transition-all ${newMessage.trim() && !uploading ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}
                  disabled={!newMessage.trim() || uploading}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500 mb-6 animate-bounce">
              <MessageSquare size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to ChatApp Pro</h2>
            <p className="text-slate-400 max-w-sm">Select a conversation or create a new room to start chatting.</p>
            <button onClick={() => setIsSidebarOpen(true)} className="sm:hidden mt-8 px-8 py-3 bg-indigo-600 rounded-2xl font-bold text-white shadow-lg shadow-indigo-600/30">Start Chatting</button>
          </div>
        )}
      </div>

      {/* Join/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-md relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
              <JoinCreateChat closeModal={() => setIsModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;
