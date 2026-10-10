import React from 'react';

export default function NotFound() {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50 p-4 lg:p-6">
            {/* Main Container Card */}
            <div className="flex h-full w-full flex-col items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-12">
                {/* Top Header / Brand Logo */}
                <div className="flex w-full justify-between items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200">
                        A
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        Error 404
                    </span>
                </div>

                {/* Center Content Section */}
                <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                    {/* Big Graphic Badge */}
                    <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 sm:h-36 sm:w-36">
                        <span className="text-5xl font-black text-indigo-600 sm:text-6xl">404</span>
                        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Heading & Subtitle */}
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        Page not found
                    </h1>
                    <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                        Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or never existed.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={handleGoBack}
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        >
                            <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go back
                        </button>

                        <a
                            href="/"
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        >
                            Take me home
                        </a>
                    </div>
                </div>

                {/* Footer Support Link */}
                <div className="text-center text-xs text-gray-400">
                    Need help?{' '}
                    <a href="#support" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Contact support
                    </a>
                </div>
            </div>
        </div>
    );
}