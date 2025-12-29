import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const API_BASE =
  "https://customer-support-ai-561129735156.europe-west1.run.app";

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = messages.some((msg) => msg.sender === "user");

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    fetch(`${API_BASE}/chat/history/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const history: Message[] = data.messages.map((m: any) => ({
          id: crypto.randomUUID(),
          content: m.text,
          sender: m.sender === "user" ? "user" : "assistant",
          timestamp: new Date(m.createdAt),
        }));
        setMessages(history);
      })
      .catch(() => {
        console.error("Failed to fetch chat history.");
      });
  }, []);


  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const sessionId = localStorage.getItem("sessionId");

    try {
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.sessionId) {
        localStorage.setItem("sessionId", data.sessionId);
      }

 
      await new Promise((res) => setTimeout(res, 400));

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.reply,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content:
            "Sorry, something went wrong. Please try again in a moment.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  
  if (!hasUserMessages) {
    return (
      <div className="flex flex-col h-screen max-w-full mx-auto bg-white shadow-lg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="text-center mb-12 max-w-3xl">
            <img
              src="/images/logo.png"
              alt="Spur Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Spur
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Your AI-powered customer support assistant. Ask me anything.
            </p>
          </div>
          <div className="w-full max-w-3xl">
            <InputBar
              onSendMessage={handleSendMessage}
              isDisabled={isTyping}
              isCentered
            />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen max-w-full mx-auto bg-white shadow-lg">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputBar onSendMessage={handleSendMessage} isDisabled={isTyping} />
    </div>
  );
};

export default ChatWindow;
