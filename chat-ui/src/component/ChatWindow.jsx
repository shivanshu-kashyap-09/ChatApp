import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MdAdd, MdAttachFile, MdSend } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import JoinCreateChat from "./JoinCreateChat";
import axios from "axios";
import { timeAgo } from "../config/helper";
import chatIcon from "../assets/chat.png";

const ChatWindow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("loginEmail"));
  const [showRooms, setShowRooms] = useState(true);
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem("loginUserName");

  // Handle logout
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }
    setConnected(false);
    setSelectedRoom(null);
    setCurrentUser(null);
    toast.success("logout.");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // Leave room
  const handleLogoutRoom = async () => {
    try {
      const response = await axios.post(
        `http://tomcat.localhost:8080/chat-room/remove-room/${userName}`,
        selectedRoom.roomId,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Leave room.");
      } else {
        toast.error("Failed to leave room.");
      }

      navigate("/");
    } catch (error) {
      console.error("Error occurred while leaving the room:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Fetch rooms on load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const email = localStorage.getItem("loginEmail");
        const response = await axios.get(
          `http://tomcat.localhost:8080/chat-room/room-list/${email}`
        );
        setRooms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Fetch messages when a room is selected
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://tomcat.localhost:8080/chat-room/message/${selectedRoom.roomId}`
          );
          setMessages(response.data || []);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedRoom]);

  // WebSocket connection and subscription
  useEffect(() => {
    if (selectedRoom && currentUser) {
      const client = Stomp.over(() => new SockJS("http://tomcat.localhost:8080/chat"));

      client.connect(
        {},
        () => {
          stompClientRef.current = client;
          setConnected(true);
          toast.success("Connected to WebSocket");

          client.subscribe(`/topic/room/${selectedRoom.roomId}`, (message) => {
            try {
              const newMessage = JSON.parse(message.body);
              setMessages((prev) => [...prev, newMessage]);
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          });
        },
        (error) => {
          console.error("WebSocket connection error:", error);
        }
      );

      return () => {
        if (client) {
          client.disconnect(() => console.log("WebSocket Disconnected"));
          stompClientRef.current = null;
          setConnected(false);
        }
      };
    }
  }, [selectedRoom, currentUser]);

  // Scroll to the bottom of the chat on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Send a message
  const sendMessage = () => {
    if (stompClientRef.current && newMessage.trim()) {
      const message = {
        sender: userName,
        content: newMessage,
        roomId: selectedRoom.roomId,
      };
      stompClientRef.current.send(
        `/app/sendMessage/${selectedRoom.roomId}`,
        {},
        JSON.stringify(message)
      );
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Left Sidebar */}
      <div className="sm:w-1/3 w-full bg-gray-900 text-white flex flex-col">
        <div className="flex flex-row items-center justify-between p-2 sm:p-4">
          <img src={chatIcon} className="w-14 sm:w-10" alt="Chat Icon" />
          <h1 className="text-l md:text-2xl font-bold sm:pr-4">ChatApp</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <MdAdd
              size={30}
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Show/Hide Rooms Button */}
        <button
          className="bg-blue-600 px-4 py-3 w-full md:hidden text-left font-bold text-lg"
          onClick={() => setShowRooms(!showRooms)}
        >
          <FaBars className="inline mr-2" /> {showRooms ? "Hide Rooms" : "Show Rooms"}
        </button>

        {/* Room List */}
        {showRooms && (
          <div className="p-4 flex-1 overflow-auto">
            {rooms.length === 0 ? (
              <p className="text-gray-400">No rooms available.</p>
            ) : (
              <ul className="space-y-2">
                {rooms.map((room) => (
                  <li
                    key={room.id}
                    className={`p-2 rounded ${
                      selectedRoom?.id === room.id
                        ? "bg-blue-600"
                        : "hover:bg-blue-500"
                    } cursor-pointer`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room.roomId}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Main Chat Display */}
      <div className="sm:w-2/3 w-full bg-gray-700 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <header className="w-full h-[65px] py-5 bg-gray-900 shadow flex justify-between items-center px-4 sticky top-0 z-10">
              <h1 className="text-lg font-semibold">
                User: <span>{userName}</span>
              </h1>
              <h2 className="font-bold">
                Room: <span>{selectedRoom.roomId}</span>
              </h2>
              <button
                onClick={handleLogoutRoom}
                className="bg-red-500 hover:bg-red-700 rounded px-3 py-2"
              >
                Leave Room
              </button>
            </header>

            {/* Messages */}
            <main
              ref={chatBoxRef}
              className="flex-1 py-4 px-4 bg-slate-600 overflow-y-auto"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === userName
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div className="flex items-center gap-2 p-2 max-w-xs bg-white rounded">
                    <img
                      className="h-10 w-10"
                      src="https://avatar.iran.liara.run/public/43"
                      alt="avatar"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-black font-bold">{message.sender}</p>
                      <p className="text-black" >{message.content}</p>
                      <p className="text-xs text-gray-400">
                        {timeAgo(message.sendTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </main>

            {/* Input Area */}
            <div className="p-4 w-full flex items-center bg-gray-800 sticky bottom-0">
              <MdAttachFile
                size={24}
                className="mr-2 text-gray-400 cursor-pointer"
              />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-black focus:outline-none p-2 rounded-md border w-full text-sm sm:text-base"

                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded flex items-center"
              >
                <MdSend size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a room to start messaging...
          </div>
        )}
      </div>

      {/* Modal for Join/Create Chat */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <JoinCreateChat closeModal={() => setIsModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
