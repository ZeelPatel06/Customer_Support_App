import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import Offline from "../features/Shared/Offline.jsx";
import FloatingNavbar from "../features/Shared/Components/Navbar.jsx";

const App = () => {
  const [isOnline, setIsOnline] = useState(
    navigator.onLine
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <Offline
        onRetry={() => queryClient.refetchQueries()}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <FloatingNavbar />

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default App;