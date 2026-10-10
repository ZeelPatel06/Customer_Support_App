import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot, User } from "lucide-react";
import {
useSendChatMessage,
useClearChat,
} from "../hooks/useChat.js";

const ChatPage = () => {
const [question, setQuestion] = useState("");
const [conversationId, setConversationId] = useState(null);
const [messages, setMessages] = useState([]);

const messagesEndRef = useRef(null);

const {
    mutate: sendMessage,
    isPending: isSending,
} = useSendChatMessage();

const {
    mutate: clearChat,
    isPending: isClearing,
} = useClearChat();

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
    });
}, [messages, isSending]);

const handleSendMessage = (e) => {
    e?.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) {
        return;
    }

    setMessages((prev) => [
        ...prev,
        {
            role: "user",
            content: trimmedQuestion,
        },
    ]);

    setQuestion("");

    sendMessage(
        {
            question: trimmedQuestion,
            ...(conversationId && { conversationId }),
        },
        {
            onSuccess: (response) => {
                const data = response?.data;

                if (!data) {
                    return;
                }

                setConversationId(data.conversationId);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: data.answer,
                    },
                ]);
            },

            onError: () => {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Sorry, something went wrong. Please try again.",
                        isError: true,
                    },
                ]);
            },
        }
    );
};

const handleClearChat = () => {
    if (!conversationId || isClearing) {
        setMessages([]);
        setConversationId(null);
        return;
    }

    clearChat(conversationId, {
        onSuccess: () => {
            setMessages([]);
            setConversationId(null);
        },
    });
};

return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-50 pt-2 dark:bg-slate-950">

        {/* Chat Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <Bot size={22} />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base dark:text-white">
                            AI Support Assistant
                        </h1>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            Ask questions about your knowledge base
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={handleClearChat}
                    disabled={isClearing || messages.length === 0}
                    className="ml-3 flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">
                        {isClearing ? "Clearing..." : "Clear"}
                    </span>
                </button>

            </div>
        </header>

        {/* Main Chat */}
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6">

            {/* Messages */}
            <div className="h-[calc(100vh-15rem)] overflow-y-auto py-6">

                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center px-4">
                        <div className="max-w-md text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                <Bot size={30} />
                            </div>

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                How can I help?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Ask a question about the information
                                available in your knowledge base.
                            </p>

                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex w-full gap-3 ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >

                                {/* AI Avatar */}
                                {message.role === "assistant" && (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                        <Bot size={18} />
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                                        message.role === "user"
                                            ? "bg-indigo-600 text-white"
                                            : message.isError
                                            ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                                            : "bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                                        {message.content}
                                    </p>
                                </div>

                                {/* User Avatar */}
                                {message.role === "user" && (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        <User size={18} />
                                    </div>
                                )}

                            </div>
                        ))}

                        {/* AI Loading */}
                        {isSending && (
                            <div className="flex gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Bot size={18} />
                                </div>

                                <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-slate-900">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                                    </div>
                                </div>

                            </div>
                        )}

                        <div ref={messagesEndRef} />

                    </div>
                )}

            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-200 bg-slate-50 py-4 dark:border-slate-800 dark:bg-slate-950"
            >
                <div className="flex items-end gap-3">

                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Ask something about your knowledge base..."
                        rows={1}
                        disabled={isSending}
                        className="min-h-12 max-h-32 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                        type="submit"
                        disabled={!question.trim() || isSending}
                        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>

                </div>

                <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    Press Enter to send · Shift + Enter for a new line
                </p>
            </form>

        </div>
    </div>
);
};

export default ChatPage;
