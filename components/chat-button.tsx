"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiSend, FiX, FiMinus, FiMic, FiMicOff, FiVolume2, FiVolumeX } from "react-icons/fi";

interface Message {
  text: string;
  sender: "User" | "AI";
  timestamp: number;
  code?: boolean;
  isStreaming?: boolean;
  fullText?: string;
}

const suggestions = [
  "Show me your projects",
  "What's your tech stack?",
  "How can I contact you?",
  "Tell me about your experience",
];

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm Idrissa's AI assistant. Ask me anything about his work, skills, or projects.",
      sender: "AI",
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatHistory = useRef<HTMLDivElement | null>(null);
  const streamingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completedMessages = messages.map((msg) => ({
        ...msg,
        text: msg.fullText || msg.text,
        isStreaming: false,
        fullText: undefined,
      }));
      localStorage.setItem("chatMessages", JSON.stringify(completedMessages));
    }
  }, [messages]);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus the input when chat is opened
  useEffect(() => {
    if (isChatOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      setHasUnreadMessage(false);
    }
  }, [isChatOpen, isMinimized]);

  // Clean up streaming timer on unmount
  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) {
        clearTimeout(streamingTimerRef.current);
      }
    };
  }, []);

  // Voice input (Web Speech API)
  const startListening = () => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        sendMessage(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Voice output (Web Speech Synthesis)
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/```[\s\S]*?```/g, "code block").replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  // Adjust textarea height based on content
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const toggleChat = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      setIsMinimized(false);
    } else {
      setIsChatOpen(true);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsChatOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Stream text character by character
  const streamText = (fullText: string, messageIndex: number) => {
    let currentIndex = 0;
    const streamingSpeed = 30;
    const punctuationPause = 150;

    const streamNextChar = () => {
      if (currentIndex <= fullText.length) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            text: fullText.substring(0, currentIndex),
            fullText: fullText,
            isStreaming: currentIndex < fullText.length,
          };
          return updatedMessages;
        });

        currentIndex++;
        const delay =
          currentIndex > 1 && /[.,!?;:]/.test(fullText[currentIndex - 2])
            ? punctuationPause
            : streamingSpeed;
        streamingTimerRef.current = setTimeout(streamNextChar, delay);
      } else {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            isStreaming: false,
          };
          return updatedMessages;
        });
        speakText(fullText);
      }
    };

    streamNextChar();
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      text: text,
      sender: "User",
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setUserMessage("");
    setIsTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCommand: text,
          history: newMessages.slice(-10).map(m => ({
            sender: m.sender,
            text: m.fullText || m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      if (!data.response && !data.action) {
        throw new Error("Invalid response format");
      }

      // Dispatch portfolio action if the AI called a tool
      if (data.action) {
        // Auto-minimize chat so user can see the action happening
        const navActions = ["navigate_to_section", "show_project", "get_contact_info", "highlight_skill", "show_stats"];
        if (navActions.includes(data.action.type)) {
          setTimeout(() => {
            setIsChatOpen(false);
            setIsMinimized(true);
          }, 800);
        }

        // Small delay so chat shows the response first, then acts
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("portfolio-action", {
              detail: data.action,
            })
          );
        }, 400);
      }

      const aiText =
        data.response ||
        (data.action ? "Done! I've performed that action for you." : "");

      const containsCode =
        text.toLowerCase().includes("code") ||
        text.toLowerCase().includes("example") ||
        aiText.includes("```");

      const aiResponseIndex = newMessages.length;
      setMessages([
        ...newMessages,
        {
          text: "",
          fullText: aiText,
          sender: "AI",
          timestamp: Date.now(),
          code: containsCode,
          isStreaming: true,
        },
      ]);

      if (!isChatOpen) {
        setHasUnreadMessage(true);
      }

      setTimeout(() => {
        streamText(aiText, aiResponseIndex);
      }, 500);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages([
        ...newMessages,
        {
          text: "Sorry, I encountered an error processing your request. Please try again later.",
          sender: "AI",
          timestamp: Date.now(),
        },
      ]);

      if (!isChatOpen) {
        setHasUnreadMessage(true);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(userMessage);
  };

  // Render message content with code formatting
  const renderMessageContent = (message: Message) => {
    const textToRender = message.text;

    const cursorElement = message.isStreaming ? (
      <span className="inline-block w-0.5 h-4 ml-0.5 bg-blue-400 animate-blink align-middle" />
    ) : null;

    if (message.code && textToRender.includes("```")) {
      return (
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {textToRender.split(/(```[\s\S]*?```)/g).map((part, i) => {
            if (part.startsWith("```") && part.endsWith("```")) {
              const match = part.match(/```(.+?)\n([\s\S]*?)```/);
              if (match) {
                const [, lang, code] = match;
                return (
                  <div key={i} className="my-2">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-medium">
                      {lang}
                    </div>
                    <div className="bg-black/40 text-gray-200 p-3 rounded-lg font-mono text-xs overflow-x-auto border border-white/[0.06]">
                      {code.replace(/</g, "<").replace(/>/g, ">")}
                    </div>
                  </div>
                );
              }
              return <span key={i}>{part}</span>;
            }
            return <span key={i}>{part}</span>;
          })}
          {cursorElement}
        </div>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {textToRender}
        {cursorElement}
      </div>
    );
  };

  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-blue-600/90 backdrop-blur-md border border-blue-400/20 text-white font-medium text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow cursor-pointer select-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            aria-label="Open AI chat"
          >
            <FiMessageCircle className="w-[18px] h-[18px]" />
            <span>Ask AI</span>

            {/* Unread pulse glow */}
            {hasUnreadMessage && (
              <>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-300" />
                </span>
                <span className="absolute inset-0 rounded-2xl animate-pulse-slow opacity-40 shadow-[0_0_20px_6px_rgba(59,130,246,0.5)]" />
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed z-50 bottom-6 right-6 w-[90vw] max-w-[420px] flex flex-col rounded-2xl overflow-hidden bg-[#0a0f1e]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-blue-500/10"
            style={{ height: "min(600px, calc(100vh - 48px))", minHeight: "400px" }}
            initial={{ scale: 0.85, opacity: 0, y: 30, transformOrigin: "bottom right" }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.05] border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Online indicator */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                </span>
                <span className="text-white font-semibold text-sm tracking-tight">
                  Idrissa&apos;s AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMinimize}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Minimize chat"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close chat"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              ref={chatHistory}
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.sender === "User" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 ${
                      message.sender === "AI"
                        ? "bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-tl-sm text-gray-200"
                        : "bg-blue-600/80 rounded-2xl rounded-tr-sm text-white"
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              ))}

              {/* Suggestion chips */}
              {showSuggestions && (
                <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="text-xs text-left px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-200 transition-all duration-200 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[85%] px-3.5 py-3 bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-tl-sm">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 px-3 py-3 border-t border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
                {/* Mic button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                    isListening
                      ? "bg-red-500/80 text-white animate-pulse"
                      : "bg-white/[0.06] text-gray-400 hover:text-blue-400 hover:bg-blue-500/20"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? <FiMicOff className="w-3.5 h-3.5" /> : <FiMic className="w-3.5 h-3.5" />}
                </button>
                <textarea
                  ref={inputRef}
                  value={userMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Ask me anything about Idrissa..."}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-gray-200 text-sm placeholder-gray-500 outline-none leading-relaxed py-1.5"
                  style={{ minHeight: "32px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isTyping}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-30 disabled:hover:bg-blue-600 cursor-pointer"
                  aria-label="Send message"
                >
                  <FiSend className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <button
                  onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) window.speechSynthesis?.cancel(); }}
                  className={`flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                    voiceEnabled ? "text-blue-400" : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {voiceEnabled ? <FiVolume2 className="w-3 h-3" /> : <FiVolumeX className="w-3 h-3" />}
                  {voiceEnabled ? "Voice on" : "Voice off"}
                </button>
                <span className="text-[10px] text-gray-600">
                  Enter to send · Shift+Enter new line
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for scrollbar and cursor blink animation */}
      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 0.8s steps(2, start) infinite;
        }
      `}</style>
    </>
  );
}
