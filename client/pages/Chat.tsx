import React, { useState, useRef, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { marked } from "marked";

const DEFAULT_BACKEND = "https://mental-healthcare-guidance-chatbot.onrender.com";

const MicSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SendSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeleteSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground hover:text-destructive transition-colors">
    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuSVG = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
  <svg
    className={`w-6 h-6 transition-transform transform ${!isSidebarOpen ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 4.5L7.5 12L15 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WaveformVisualizer = ({ bars }: { bars: number[] }) => {
  return (
    <div className="flex items-end justify-center h-5 w-12">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-primary mx-px transition-all duration-75 ease-in-out"
          style={{ height: `${h * 0.75 + 10}px` }}
        />
      ))}
    </div>
  );
};

const UserWaveformVisualizer = () => (
  <div className="flex items-end justify-center h-5 w-12">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="w-1 bg-white rounded-full mx-px animate-wave"
        style={{ animationDelay: `${i * 0.1}s`, animationDirection: "reverse" }}
      />
    ))}
  </div>
);

const UserMessage = ({ content, isSpeaking }: { content: string; isSpeaking: boolean }) => (
  <div className="flex justify-end mb-2">
    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] whitespace-pre-wrap break-words shadow-lg flex flex-col items-center gap-2 overflow-hidden">
      {isSpeaking && (
        <div className="w-full flex justify-center mb-2">
          <UserWaveformVisualizer />
        </div>
      )}
      <div>{content}</div>
    </div>
  </div>
);

const AiMessage = ({ content, isPlaying, bars }: { content: string; isPlaying: boolean; bars: number[] }) => {
  const htmlContent = useMemo(() => marked(content), [content]);

  return (
    <div className="flex justify-start mb-2">
      <div className="bg-muted text-foreground p-3 rounded-lg max-w-[80%] whitespace-pre-wrap shadow-lg flex flex-col items-center gap-2 overflow-hidden">
        {isPlaying && (
          <div className="w-full flex justify-center mb-2">
            <WaveformVisualizer bars={bars} />
          </div>
        )}
        <div className="ai-markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent as string }} />
      </div>
    </div>
  );
};

function useOutputAnalyser() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(12).fill(0));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!audioCtxRef.current) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }
  }, []);

  const playBlob = async (blob: Blob) => {
    stopPlayback();
    if (!audioCtxRef.current) return;

    try {
      const arrayBuf = await blob.arrayBuffer();
      const audioBuf = await audioCtxRef.current.decodeAudioData(arrayBuf);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuf;
      source.connect(analyserRef.current!);
      analyserRef.current!.connect(audioCtxRef.current.destination);
      sourceRef.current = source;
      source.start();
      setIsPlaying(true);
      source.onended = () => {
        setTimeout(() => {
          setIsPlaying(false);
          setBars(Array(12).fill(0));
          sourceRef.current = null;
        }, 50);
        source.disconnect();
      };
    } catch (error) {
      console.error("Error decoding or playing audio:", error);
      setIsPlaying(false);
      sourceRef.current = null;
    }
  };

  const stopPlayback = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch {}
      try { sourceRef.current.disconnect(); } catch {}
      sourceRef.current = null;
    }
    setIsPlaying(false);
    setBars(Array(12).fill(0));
  };

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(12).fill(0));
      return;
    }

    let raf: number;
    const tick = () => {
      const analyser = analyserRef.current;
      const arr = dataArrayRef.current;
      if (!analyser || !arr) return;
      analyser.getByteFrequencyData(arr);
      const columns = 12;
      const bucket = Math.floor(arr.length / columns);
      const next = new Array(columns).fill(0).map((_: any, i: number) => {
        let m = 0;
        for (let j = i * bucket; j < (i + 1) * bucket; j++) m = Math.max(m, arr[j] || 0);
        return Math.max(0, Math.round((m / 255) * 80));
      });
      setBars(next as number[]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  return { isPlaying, bars, playBlob, stopPlayback };
}

function beep(open = true) {
  const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = open ? 880 : 520;
  gain.gain.value = 0.0001;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.start();
  osc.stop(now + 0.18);
  osc.onended = () => ctx.close();
}

const sampleQueries = [
  "Tell me about anxiety.",
  "What are some coping mechanisms?",
  "Suggest a simple breathing exercise.",
  "How can I manage stress at work?",
];

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0 && error instanceof TypeError) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
};

export default function Chat() {
  const [allMessages, setAllMessages] = useState<Record<string, any[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const { isPlaying, bars, playBlob, stopPlayback } = useOutputAnalyser();
  const voice = "Kore";
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [chatSessions, setChatSessions] = useState<{ id: string; title: string }[]>([
    { id: "chat-1", title: "New Chat" },
  ]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const language = "en-US";

  const filteredMessages = useMemo(() => allMessages[activeChatId] || [], [allMessages, activeChatId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const handleSendMessage = async (query: string) => {
    if (!query.trim() || isThinking) return;
    stopPlayback();

    if (filteredMessages.length === 0) {
      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === activeChatId
            ? { ...session, title: query.slice(0, 20) + (query.length > 20 ? "..." : "") }
            : session,
        ),
      );
    }

    const newUserMessage = { role: "user", content: query, id: Date.now() };
    setAllMessages((prevAllMessages) => ({
      ...prevAllMessages,
      [activeChatId]: [...(prevAllMessages[activeChatId] || []), newUserMessage],
    }));
    setInputMessage("");
    setIsThinking(true);

    let rawAnswer = "Sorry, I couldn't generate a response.";
    let ttsText = "";

    try {
      const body = new URLSearchParams();
      body.set("query", query);
      body.set("session_id", activeChatId);

      const res = await fetchWithRetry(`${DEFAULT_BACKEND}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const json = await res.json();
      rawAnswer = json.answer || rawAnswer;
    } catch (e: any) {
      if (e instanceof TypeError && e.message === "Failed to fetch") {
        rawAnswer = "Connection failed. The server might be asleep or unreachable. Please try again in a moment.";
      } else {
        rawAnswer = `An error occurred: ${e.message}`;
      }
    } finally {
      const newAiMessage = { role: "ai", content: rawAnswer, id: Date.now() };
      setAllMessages((prevAllMessages) => ({
        ...prevAllMessages,
        [activeChatId]: [...(prevAllMessages[activeChatId] || []), newAiMessage],
      }));

      if (rawAnswer && !rawAnswer.includes("Connection failed")) {
        ttsText = rawAnswer.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/[#*_-]/g, "");

        try {
          const ttsBody = new URLSearchParams();
          ttsBody.set("text", ttsText);
          ttsBody.set("lang", language);
          ttsBody.set("voice", voice);

          const ttsRes = await fetchWithRetry(`${DEFAULT_BACKEND}/tts`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: ttsBody,
          });

          if (ttsRes) {
            const ttsBlob = await ttsRes.blob();
            await playBlob(ttsBlob);
          }
        } catch (ttsError) {
          console.warn("Error fetching TTS audio:", ttsError);
        }
      }
      setIsThinking(false);
    }
  };

  const startRecognition = () => {
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser.");
      setShowError(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      beep(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setErrorMessage(`Speech recognition error: ${event.error}`);
      setShowError(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      beep(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleMicClick = () => {
    if (isListening) stopRecognition();
    else {
      stopRecognition();
      startRecognition();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputMessage.trim()) {
      handleSendMessage(inputMessage);
    }
  };

  const resetToInitialState = () => {
    stopPlayback();
    const newChatId = `chat-${Date.now()}`;
    setChatSessions([{ id: newChatId, title: "New Chat" }]);
    setAllMessages({});
    setActiveChatId(newChatId);
  };

  const handleNewChat = () => {
    stopPlayback();
    const newChatId = `chat-${Date.now()}`;
    setChatSessions((prev) => [...prev, { id: newChatId, title: "New Chat" }]);
    setActiveChatId(newChatId);
  };

  const handleClearAllChats = () => {
    resetToInitialState();
  };

  const handleDeleteChat = (chatIdToDelete: string) => {
    const remainingSessions = chatSessions.filter((s) => s.id !== chatIdToDelete);
    if (remainingSessions.length === 0) {
      resetToInitialState();
    } else {
      setChatSessions(remainingSessions);
      if (activeChatId === chatIdToDelete) setActiveChatId(remainingSessions[0].id);
      setAllMessages((prev) => {
        const next: Record<string, any[]> = { ...prev };
        delete next[chatIdToDelete];
        return next;
      });
    }
  };

  const handleChatSelect = (chatId: string) => {
    stopPlayback();
    setActiveChatId(chatId);
  };

  return (
    <div className="rounded-3xl border bg-card shadow-xl">
      <style>{`
        @keyframes wave { 0%, 100% { height: 20%; } 50% { height: 100%; } }
        .animate-wave > div { animation: wave 1.2s ease-in-out infinite; }
        .ai-markdown-content { line-height: 1.6; }
        .ai-markdown-content p { margin-bottom: 0.5rem; }
        .ai-markdown-content ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .ai-markdown-content ol { list-style: decimal; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .ai-markdown-content li { margin-bottom: 0.25rem; }
        .ai-markdown-content h2 { font-size: 1.25rem; margin: .5rem 0; font-weight: 700; }
        .main-chat-area::-webkit-scrollbar { display: none; }
        .main-chat-area { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex h-[75vh] overflow-hidden rounded-3xl">
        <aside className={`hidden md:flex flex-col transition-all duration-300 border-r ${isSidebarOpen ? "w-64" : "w-0"}`}>
          <div className={`flex flex-col flex-1 p-4 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-lg font-semibold mb-4">Chat History</h2>
            <div className="flex-1 overflow-y-auto">
              {chatSessions.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between group">
                  <button
                    onClick={() => handleChatSelect(chat.id)}
                    className={`flex-1 text-left py-2 px-3 rounded-lg mb-2 transition-colors ${activeChatId === chat.id ? "bg-accent" : "hover:bg-accent"} overflow-hidden whitespace-nowrap text-ellipsis`}
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                    className="p-2 ml-2 transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label={`Delete chat ${chat.title}`}
                  >
                    <DeleteSVG />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleNewChat} className="mt-4 w-full py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">+ New Chat</button>
            <button onClick={handleClearAllChats} className="mt-2 w-full py-2 rounded-lg border hover:bg-accent">Clear All Chats</button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-2 p-2 rounded-full hover:bg-accent" aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}>
                <MenuSVG isSidebarOpen={isSidebarOpen} />
              </button>
              <h1 className="text-xl font-bold">Mental Health AI Assistant</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">Session: {activeChatId}</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 main-chat-area">
            <div className="max-w-3xl mx-auto flex flex-col h-full">
              {filteredMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <h2 className="text-3xl font-semibold mb-2">Your Compassionate Buddy</h2>
                  <p className="max-w-md">How can I help you today?</p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {sampleQueries.map((query, index) => (
                      <button key={index} onClick={() => handleSendMessage(query)} className="bg-accent hover:bg-accent/80 text-foreground p-4 rounded-lg shadow-sm text-left">
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto mb-4">
                  <AnimatePresence>
                    {filteredMessages.map((msg: any) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        {msg.role === "user" ? (
                          <UserMessage content={msg.content} isSpeaking={isListening} />
                        ) : (
                          <AiMessage content={msg.content} isPlaying={isPlaying} bars={bars} />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          </main>

          <footer className="p-4 border-t">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative w-full">
                {isListening && <div className="absolute inset-0 bg-primary/10 rounded-xl animate-pulse" />}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isListening || isThinking}
                  placeholder={isListening ? "Listening..." : "Type your message or use the mic..."}
                  className="w-full px-4 py-3 rounded-xl border bg-background placeholder-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <button onClick={handleMicClick} disabled={isThinking} className={`h-12 w-12 flex items-center justify-center rounded-xl ${isListening ? "bg-destructive text-destructive-foreground" : "border hover:bg-accent"}`} aria-label={isListening ? "Stop recording" : "Start voice input"}>
                <MicSVG />
              </button>
              <button onClick={() => handleSendMessage(inputMessage)} disabled={!inputMessage.trim() || isListening || isThinking} className={`h-12 w-12 flex items-center justify-center rounded-xl ${!inputMessage.trim() || isListening || isThinking ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} aria-label="Send message">
                <SendSVG />
              </button>
            </div>
            {isThinking && <div className="mt-2 text-center text-sm text-muted-foreground">Thinking...</div>}
          </footer>
        </div>
      </div>

      {showError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-card p-6 rounded-lg text-center shadow-lg border">
            <h3 className="text-xl font-bold text-destructive mb-2">Error</h3>
            <p className="text-sm">{errorMessage}</p>
            <button onClick={() => setShowError(false)} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
