import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./components/ChatWindow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ToastContainer />
      <ChatWindow />
    </div>
  );
}
