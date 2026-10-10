import React, { useState, useEffect } from 'react';
import { Bot, Menu, X, Sparkles, Sun, Moon, User, CircleUserRound } from 'lucide-react';
import { useAuthUser } from "../../auth/hooks/useAuth.js";
import { Link } from 'react-router';

export default function FloatingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { data: user } = useAuthUser();

    // Initialize state from document or localStorage
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    useEffect(() => {
        // Check for specific properties rather than just non-null
        if (user && Object.keys(user).length > 0) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [user]);

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Persist the user choice in localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Handle Theme Toggle & Persistence
    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);

        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Handle subtle background opacity shift on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'Integrations', href: '#integration' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <div className="pt-2 fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none bg-transparent">
            {/* Floating Navbar Pill: Handles all dark/light colors and pointer events */}
            <header
                className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 ease-in-out rounded-4xl border ${isScrolled
                    ? 'bg-white/90 border-slate-200/80 text-slate-900 shadow-xl backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800/80 dark:text-white dark:shadow-2xl py-2.5 px-6'
                    : 'bg-white/70 border-slate-200/60 text-slate-900 shadow-lg backdrop-blur-sm dark:bg-slate-900/60 dark:border-slate-800/60 dark:text-white py-3.5 px-6'
                    }`}
            >
                <div className="flex items-center justify-between">

                    {/* Brand / Logo */}
                    <a href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl group-hover:bg-indigo-100 dark:bg-indigo-600/20 dark:border-indigo-500/30 dark:group-hover:bg-indigo-600/30 transition-colors">
                            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tracking-wide text-base hidden sm:inline-block">
                            CusSup<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                        </span>
                    </a>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-950/40 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/50">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setActiveLink(link.name)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${activeLink === link.name
                                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="hidden sm:flex items-center gap-3">
                        {/* --- DESKTOP THEME TOGGLE BUTTON --- */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-600 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-600" />
                            )}
                        </button>
                        {isLoggedIn ? (
                            <>
                                <a
                                    href="/dashboard"
                                    className="group relative inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                                >
                                    <span>Dashbaord</span>
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                                </a>
                                <Link
                                    to="/profile"
                                    className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity group"
                                    aria-label="View profile"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 duration-200"
                                        style={{
                                            background: 'linear-gradient(135deg, #312E81, #6366F1',
                                            color: '#ffff',
                                        }}
                                    >
                                        <CircleUserRound size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold leading-none tracking-tight dark:text-indigo-200">
                                        Profile
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <a
                                href="/login"
                                className="flex items-center gap-1 text-xs hover:bg-gray-300 hover:text-black font-medium text-white rounded-full bg-slate-800 dark:text-slate-300 dark:bg-slate-600 px-3 py-2 transition-colors"
                            >
                                <User size={20} />
                                Sign In
                            </a>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => {
                                    setActiveLink(link.name);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeLink === link.name
                                    ? 'bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400'
                                    : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/50 mt-1">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-2"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <Sun className="w-4 h-4 text-amber-400" /> Light Mode
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-4 h-4 text-slate-600" /> Dark Mode
                                    </>
                                )}
                            </button>
                            {isLoggedIn ? (
                                <>
                                    <a
                                        href="/dashboard"
                                        className="group relative inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                                    >
                                        <span>Get Started</span>
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                                    </a>
                                    <Link
                                        to="/profile"
                                        className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity group"
                                        aria-label="View profile"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 duration-200"
                                            style={{
                                                background: 'linear-gradient(135deg, #312E81, #6366F1)',
                                                color: '#ffff',
                                            }}
                                        >
                                            <CircleUserRound size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold leading-none tracking-tight dark:text-indigo-200">
                                            Profile
                                        </span>
                                    </Link>
                                </>
                            ) : (
                                <a
                                    href="/login"
                                    className="text-xs font-medium text-white rounded-full bg-slate-800 dark:text-slate-300 dark:bg-slate-600 px-3 py-2 transition-colors"
                                >
                                    Sign In
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}