import { Database, MessageSquare, FileText, ArrowRight, CheckCircle2, DatabaseX } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboard.js";
import { Link } from "react-router";
import ChatbotWidgetCard from "../../credentials/pages/ChabotWidgetCard.jsx";

const Dashboard = () => {
    const { data, isLoading, isError } = useDashboardStats();

    const dashboardData = data?.data;

    const stats = [
        {
            title: "Knowledge Sources",
            value: isLoading ? "..." : dashboardData?.knowledgeSources ?? 0,
            icon: Database,
            description: "Documents and text sources",
            bg: "bg-indigo-100 dark:bg-indigo-950/30"
        },
        {
            title: "AI Conversations",
            value: isLoading ? "..." : dashboardData?.aiConversations ?? 0,
            icon: MessageSquare,
            description: "Customer conversations",
            bg: "bg-purple-100 dark:bg-purple-950/30"
        },
        {
            title: "Ready Sources",
            value: isLoading ? "..." : dashboardData?.readySources ?? 0,
            icon: CheckCircle2,
            description: "Available for AI answers",
            bg: "bg-emerald-100 dark:bg-emerald-950/30"
        },
        {
            title: "Failed",
            value: isLoading ? "..." : dashboardData?.failedSources ?? 0,
            icon: DatabaseX,
            description: "Sources that failed Processing",
            bg: "bg-red-100 dark:bg-red-950/30"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your knowledge base and AI customer support.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className={`rounded-2xl border border-gray-100 p-5 shadow-sm transition-colors dark:border-slate-800 ${stat.bg}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                            {stat.title}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/40">
                                        <Icon
                                            size={21}
                                            className="text-indigo-600 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Main Actions */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Knowledge Base */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                                    <Database
                                        size={22}
                                        className="text-indigo-600 dark:text-indigo-400"
                                    />
                                </div>

                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Knowledge Base
                                </h2>

                                <p className="mt-1 max-w-md text-sm leading-6 text-gray-500 dark:text-slate-400">
                                    Upload documents and add business information
                                    that your AI assistant can use to answer
                                    customer questions.
                                </p>
                            </div>
                        </div>

                        <Link to="/knowledge-base">
                            <button
                                type="button"
                                className="cursor-pointer mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                            >
                                Manage Knowledge
                                <ArrowRight size={17} />
                            </button>
                        </Link>
                    </div>

                    {/* AI Chat */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40">
                                    <MessageSquare
                                        size={22}
                                        className="text-purple-600 dark:text-purple-400"
                                    />
                                </div>

                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    AI Customer Support
                                </h2>

                                <p className="mt-1 max-w-md text-sm leading-6 text-gray-500 dark:text-slate-400">
                                    Test your AI assistant using the knowledge
                                    you've provided and see how it responds to
                                    customer questions.
                                </p>
                            </div>
                        </div>

                        <Link to={"/chatbot"}>
                            <button
                                type="button"
                                className="cursor-pointer mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500"
                            >
                                Chat with AI
                                <ArrowRight size={17} />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8">
                    <ChatbotWidgetCard />
                </div>

                {/* Getting Started */}
                <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                    <div className="flex items-start gap-4">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white sm:flex">
                            <FileText size={20} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                Get started with your AI assistant
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-400">
                                Add your company's information to the knowledge
                                base first. Your AI assistant will use that
                                information when answering customer questions.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                <span className="rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
                                    1. Add knowledge
                                </span>

                                <span className="rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
                                    2. Test AI responses
                                </span>

                                <span className="rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
                                    3. Connect to your customers
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;