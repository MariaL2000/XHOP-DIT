"use client";

import { useState, useRef, useEffect } from "react";
import { SiProbot } from "react-icons/si";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const assistantId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                accumulatedContent += JSON.parse(line.slice(2));
              } catch {
                accumulatedContent += line.slice(3, -1).replace(/\\n/g, "\n");
              }
            } else if (!line.includes(":") && line.length > 0) {
              accumulatedContent += line;
            }
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulatedContent } : m,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-9999 font-sans">
      {/* Botón Flotante - Icono Sólido Brand Black */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 p-3 md:p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white border border-white/30"
        style={{
          backgroundColor: "var(--brand-color)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Contenedor del icono con alto contraste */}
        <div
          className="relative bg-white p-2 rounded-xl shadow-inner flex items-center justify-center"
          style={{ color: "var(--brand-black)" }}
        >
          <SiProbot className="text-xl md:text-2xl" />
        </div>

        <span className="relative font-bold text-black  text-xs md:text-sm tracking-tight pr-1">
          {isOpen ? "Cerrar" : "¿Puedo ayudarte?"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 md:bottom-20 w-[calc(100vw-2rem)] sm:w-96 h-125 md:h-150 bg-white border border-gray-200 rounded-4xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300">
          {/* Header Sólido para legibilidad */}
          <div
            className="p-5 text-white flex items-center justify-between"
            style={{ backgroundColor: "var(--brand-color)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 bg-white rounded-lg"
                style={{ color: "var(--brand-black)" }}
              >
                <SiProbot className="text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-widest">
                  Asistente Virtual
                </span>
                <span className="text-[10px] opacity-80">
                  XHOPDIT AI • En línea
                </span>
              </div>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
          >
            {messages.length === 0 && (
              <div
                className="flex flex-col items-center justify-center h-full opacity-30"
                style={{ color: "var(--brand-black)" }}
              >
                <SiProbot className="text-5xl mb-3" />
                <p className="text-xs font-bold uppercase tracking-tighter">
                  ¡Hola! ¿Cómo puedo ayudarte?
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  style={{
                    backgroundColor:
                      m.role === "user"
                        ? "var(--brand-color)"
                        : "var(--brand-color)",
                    color:
                      m.role === "user"
                        ? "var(--brand-black)"
                        : "var(--brand-black)",
                  }}
                  className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm border ${
                    m.role === "user" ? "border-transparent" : "border-gray-200"
                  } ${m.role === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-1.5 p-4 items-center">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "var(--brand-color)" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]"
                  style={{ backgroundColor: "var(--brand-color)" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]"
                  style={{ backgroundColor: "var(--brand-color)" }}
                />
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="p-4 bg-white border-t border-gray-100"
          >
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl focus-within:ring-2 focus-within:ring-gray-200 transition-all">
              <input
                type="text"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{ color: "var(--brand-black)" }}
                className="flex-1 bg-transparent text-black p-2 text-sm outline-none placeholder:text-gray-400 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{ backgroundColor: "var(--brand-black)" }}
                className="
    flex items-center justify-center gap-2 
    px-5 py-2.5 
    rounded-full 
    text-white text-sm font-bold 
    tracking-tight
    transition-all duration-200 
    hover:opacity-90 hover:shadow-md
    active:scale-95 
    disabled:opacity-20 disabled:cursor-not-allowed
    shadow-sm
  "
              >
                <SiProbot className="text-base" />
                <span className="leading-none">Enviar</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
