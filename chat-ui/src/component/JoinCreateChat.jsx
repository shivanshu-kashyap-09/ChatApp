import React, { useState } from "react";
import chatIcon from "../assets/chat.png"
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import axios from "axios";

const JoinCreateChat = () => {
  const loginUserName = localStorage.getItem("loginUserName");
  const [detail, setDetail] = useState({
    roomId: "",
    userName: loginUserName,
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  const handleFromInputChange = (e) =>{
    const {name , value} = e.target;
    setDetail({...detail , [name]:value});
  }
  const joinChat = async () => {
    if (!detail.roomId || !detail.userName) {
      toast.error("Room ID and Username cannot be empty!");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://tomcat.localhost:8080/chat-room/join-room/${loginUserName}`,
        { roomId: detail.roomId }
      );
  
      console.log(response.data);
  
      if (response.status === 200 && response.data === "Joined") {
        toast.success("joined the room.");
        setCurrentUser(detail.userName);
        setRoomId(detail.roomId);
        setConnected(true);
        setIsModalOpen(false);
        navigate("/");
      } else if (response.status === 200 && response.data === "Already exist") {
        toast.error("You already joined.");
        navigate("/");
      } else if (response.status === 404 && response.data === "Room not exist") {
        toast.error("room does not exist.");
      }
    } catch (error) {
      console.error(error);
      // toast.error("An error occurred while joining the room.");
    }
  };
  

  const createRoom = async () => {
    if (!detail.roomId || !detail.userName) {
      toast.error("Room ID and Username cannot be empty!");
      return;
    }
  
    try {
      const response = await axios.post(`http://tomcat.localhost:8080/chat-room/create-room/${loginUserName}`, {
        roomId: detail.roomId,
        userName: detail.userName, 
      });
      toast.success("Room created successfully!");
      setCurrentUser(detail.userName);
      setRoomId(detail.roomId); 
      setConnected(true);
      setIsModalOpen(false);
      navigate("/ChatWindow");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data || "Room already exists!");
      } 
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src={chatIcon} className="w-24 mx-auto" />
        </div>

        <h1 className="text-2xl font-semibold text-center ">
          Join Room / Create Room ..
        </h1>
        {/* name div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Your name
          </label>
          <input
            onChange={handleFromInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter the name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* room id div */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Room ID / New Room ID
          </label>
          <input
            name="roomId"
            onChange={handleFromInputChange}
            value={detail.roomId}
            type="text"
            id="name"
            placeholder="Enter the room id"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* button  */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={joinChat}
            className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;