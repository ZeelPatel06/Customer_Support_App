import { createBrowserRouter } from "react-router";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import NotFoundPage from "../features/Shared/Components/NotFound.jsx";
import App from "./App.jsx";
import ProfilePage from "../features/auth/pages/Profile.jsx";
import Dashboard from "../features/conversation/pages/Dashboard.jsx";
import ProtectedRoute from "../features/Shared/Components/ProtectedRoute.jsx";
import KnowledgeBase from "../features/conversation/pages/KnowledgeBase.jsx";
import ChatPage from "../features/conversation/pages/ChatPage.jsx";
import Home from "../features/Shared/Components/Home.jsx";
import PublicRoute from "../features/Shared/Components/PublicRoute.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "/login",
                        element: <LoginPage />,
                    },
                    {
                        path: "/register",
                        element: <RegisterPage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "/chatbot",
                        element: <ChatPage />
                    },
                    {
                        path: "/knowledge-base",
                        element: <KnowledgeBase />
                    },
                    {
                        path: "/profile",
                        element: <ProfilePage />,
                    },
                ]
            },
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />,
    }
]);