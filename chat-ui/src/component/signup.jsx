import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";

const Signup = () => {
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    if (!email) {
      toast.error("Please enter your email to generate OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://tomcat.localhost:8080/user/generate-otp", { email});
      if (response.status === 200) {
        setIsOtpSent(true);
        toast.success("OTP sent to your email. Please check and verify.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      toast.error(error.response?.data || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.success("Please enter the OTP to verify.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("http://tomcat.localhost:8080/user/verify", { email, otp });
      if (response.status === 200) {
        setIsVerified(true);
        toast.success("Email verified successfully!");
      } else {
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      toast.error(error.response?.data || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!userName || !email || !password) {
      toast.error("Please fill all the fields before signing up.");
      return;
    }
    if (!isVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://tomcat.localhost:8080/user/signup", {
        userName,
        email,
        password,
      });
      if (response.status === 200) {
        toast.success("Signup successful.");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginEmail", email);
        localStorage.setItem("loginUserName", userName);
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing up:", error.response?.data || error.message);
      toast.error(error.response?.data || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="p-6 bg-white rounded shadow-lg w-80">
        <img src={chatIcon} className="w-14 mx-auto mb-[10px]" />

        <input
          type="text"
          value={userName}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded mb-4"
          style={{ color: "black" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          style={{ color: "black" }}
        />
        {!isOtpSent ? (
          <button
            onClick={handleGenerateOtp}
            className="px-4 py-2 bg-blue-600 text-white rounded w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-4"
              style={{ color: "black" }}
            />
            <button
              onClick={handleVerifyOtp}
              className={`px-4 py-2 rounded w-full ${isVerified ? "bg-green-600" : "bg-blue-600"} text-white`}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : isVerified ? "Verified ✔️" : "Verify OTP"}
            </button>
          </>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded mb-4 mt-4"
          style={{ color: "black" }}
        />
        <button
          onClick={handleSignup}
          className="px-4 py-2 bg-green-600 text-white rounded w-full"
          disabled={isLoading || !isVerified}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center" style={{ color: "black" }}>
          Already have an account? <a href="/" className="text-blue-600">Log In</a>
        </p>
      </div>
    </div>
  );
};
export default Signup;
