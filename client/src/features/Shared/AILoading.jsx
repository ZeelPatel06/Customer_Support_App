import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
    "Connecting to neural network...",
    "Loading customer knowledge base...",
    "Initializing context & workspace...",
    "Ready to assist!"
];

export default function AILoader({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Progress bar increment logic
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    if (onComplete) onComplete();
                    return 100;
                }
                return prev + 1;
            });
        }, 40); // Total ~4 seconds duration

        return () => clearInterval(progressInterval);
    }, [onComplete]);

    useEffect(() => {
        // Dynamic step message updates based on progress percentage
        if (progress < 30) setCurrentStep(0);
        else if (progress < 65) setCurrentStep(1);
        else if (progress < 90) setCurrentStep(2);
        else setCurrentStep(3);
    }, [progress]);

    return (
        <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">

            {/* Background Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">

                {/* Animated AI Core Icon */}
                <div className="relative mb-8 flex items-center justify-center">
                    {/* Outer Pulsing Glow */}
                    <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-24 h-24 bg-indigo-500/30 rounded-full blur-md"
                    />

                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-400"
                    />

                    {/* Central Bot Icon */}
                    <div className="absolute bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
                        <Bot className="w-8 h-8 text-indigo-400" />
                    </div>
                </div>

                {/* Header Title */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        AI Assistant Initializing
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Powered by Smart Agent Core
                    </p>
                </div>

                {/* Dynamic Status Text with Animated Swap */}
                <div className="h-6 mb-4 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentStep}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="text-sm font-medium text-indigo-300 flex items-center gap-2"
                        >
                            {progress === 100 ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : null}
                            {LOADING_STEPS[currentStep]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-slate-950 border border-slate-800/80 rounded-full h-2.5 p-0.5 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>

                {/* Percentage Counter */}
                <div className="w-full flex justify-between items-center mt-3 text-xs text-slate-500 font-mono">
                    <span>STATUS</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </div>
    );
}