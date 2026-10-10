import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';

export default function Offline({ onRetry }) {
    const [isRetrying, setIsRetrying] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleManualRetry = () => {
        setIsRetrying(true);

        // Simulate connection check animation
        setTimeout(() => {
            setIsRetrying(false);
            if (navigator.onLine) {
                setIsOnline(true);
                if (onRetry) onRetry();
            }
        }, 1200);
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">

            {/* Background Radial Glow (Amber/Red tint for disconnected state) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">

                {/* Animated Disconnected Core Visual */}
                <div className="relative mb-8 flex items-center justify-center">
                    {/* Outer Pulsing Glow */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-24 h-24 bg-amber-500/20 rounded-full blur-md"
                    />

                    {/* Warning Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/30 flex items-center justify-center"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute w-16 h-16 rounded-full border border-slate-700/60"
                    />

                    {/* Central Offline Icon */}
                    <div className="absolute bg-slate-950 p-3.5 rounded-2xl border border-amber-500/30 shadow-inner">
                        <WifiOff className="w-8 h-8 text-amber-400" />
                    </div>
                </div>

                {/* Header Title */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Connection Lost
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Agent status: Offline
                    </p>
                </div>

                {/* Description Body */}
                <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
                    Your AI customer support agent requires an active network connection to reach neural servers.
                </p>

                {/* Warning Badge */}
                <div className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Check your Wi-Fi or cellular network</span>
                </div>

                {/* Retry Button */}
                <button
                    onClick={handleManualRetry}
                    disabled={isRetrying}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                    <span>{isRetrying ? "Checking connection..." : "Retry Connection"}</span>
                </button>

            </div>
        </div>
    );
}