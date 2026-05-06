import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import JoinCreateChat from "./component/JoinCreateChat";
import ChatWindow from "./component/ChatWindow";
import Login from "./component/login";
import Signup from "./component/signup";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          } 
        />

        {/* Redirect root to chat or login */}
        <Route 
          path="/" 
          element={<Navigate to="/chat" replace />} 
        />

        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center text-white bg-slate-950">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-slate-400 mb-8">Page not found</p>
            <Navigate to="/" replace />
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
