import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Loader2 } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm your Algovia AI assistant. Stuck on this problem? I can help with hints or explanations." }] },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const { register, handleSubmit, reset, formState: { isValid } } = useForm({
        mode: 'onChange'
    });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const onSubmit = async (data) => {
        const userMessage = data.message;
        const newMessages = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
        setMessages(newMessages);
        reset();
        setIsTyping(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: newMessages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: response.data.message }] 
            }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: "I'm sorry, I encountered an error. Please try again later." }]
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0202] rounded-xl border border-rose-500/10 overflow-hidden">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-rose-500/10 bg-[#0f0707] px-6 py-3">
                <span className="text-sm font-black uppercase tracking-wider text-slate-200">Chat with AI</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-rose-500/20 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                            msg.role === "user" 
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-400" 
                            : "border-white/10 bg-white/5 text-slate-400"
                        }`}>
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user" 
                            ? "bg-rose-500/10 text-rose-100 border border-rose-500/10" 
                            : "bg-white/[0.03] text-slate-350 border border-white/5"
                        }`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400">
                            <Bot size={16} />
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl bg-white/[0.03] px-4 py-2.5 border border-white/5">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-black/45 border-t border-rose-500/10">
                <div className="relative flex items-center">
                    <input 
                        {...register("message", { required: true })}
                        placeholder="Ask for a hint..." 
                        autoComplete="off"
                        className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-rose-500/30" 
                    />
                    <button 
                        type="submit" 
                        disabled={!isValid || isTyping}
                        className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:text-slate-600"
                    >
                        {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;