import "./App.css";
import { Routes, Route } from "react-router";
import JoinCreateChat from "./component/JoinCreateChat";
import ChatWindow from "./component/ChatWindow";
import Login from "./component/login";
import Signup from "./component/signup";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const loginEmail = localStorage.getItem("loginEmail");
  const loginUserName = localStorage.getItem("loginUserName");
  return (
    <div>
      <Routes>
        <Route path="/" element={isAuthenticated && loginEmail != null && loginUserName != null ? <ChatWindow /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/join-create-chat" element={<JoinCreateChat />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </div>
  );
}
export default App;
