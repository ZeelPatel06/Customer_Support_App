import { useState } from "react";
import toast from "react-hot-toast";
import { useLogin } from "../hooks/useAuth.js";
import AILoader from "../../Shared/AILoading.jsx";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const { mutate: login, isPending } = useLogin();

    if (isPending) {
        return <AILoader />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (error) {
            setError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.identifier || !formData.password) {
            setError("Please fill in all fields");
            return;
        }
        login(formData, {
            onSuccess: () => {
                toast.success("Login successful!");
            },
            onError: (err) => {
                const message =
                    err?.response?.data?.message ||
                    "Login failed. Please try again.";

                setError(message);
            },
        });
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-950">
            <div
                className="
                    flex
                    min-h-screen
                    w-full
                    flex-col
                    gap-3
                    p-3
                    sm:p-4
                    lg:h-screen
                    lg:flex-row
                    lg:overflow-hidden
                "
            >
                {/* Login Section */}
                <div
                    className="
                        order-2
                        flex
                        w-full
                        items-center
                        justify-center
                        overflow-x-hidden
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-gray-100
                        bg-white
                        px-5
                        py-6
                        shadow-xl
                        dark:border-gray-800
                        dark:bg-gray-900
                        lg:order-1
                        lg:h-full
                        lg:w-1/2
                        lg:px-10
                        lg:py-5
                    "
                >
                    <div className="w-full max-w-sm">
                        {/* Header */}
                        <div className="mb-5">
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Welcome back
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="
                                    mb-4
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-2.5
                                    text-center
                                    text-xs
                                    text-red-600
                                    dark:border-red-900/50
                                    dark:bg-red-950/40
                                    dark:text-red-400
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {/* Email / Mobile */}
                            <div>
                                <label
                                    htmlFor="identifier"
                                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                                >
                                    Email or Mobile Number
                                </label>

                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="Enter email or mobile number"
                                    className="
                                        mt-1
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        text-gray-900
                                        shadow-sm
                                        outline-none
                                        placeholder:text-gray-400
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-500/20
                                        dark:border-gray-700
                                        dark:bg-gray-800
                                        dark:text-white
                                        dark:placeholder:text-gray-500
                                    "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                                >
                                    Password
                                </label>

                                <div className="relative mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            px-3
                                            py-2
                                            pr-14
                                            text-sm
                                            text-gray-900
                                            shadow-sm
                                            outline-none
                                            placeholder:text-gray-400
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-500/20
                                            dark:border-gray-700
                                            dark:bg-gray-800
                                            dark:text-white
                                            dark:placeholder:text-gray-500
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="
                                            absolute
                                            inset-y-0
                                            right-0
                                            flex
                                            items-center
                                            px-3
                                            text-xs
                                            font-semibold
                                            text-indigo-600
                                            hover:text-indigo-500
                                            dark:text-indigo-400
                                            dark:hover:text-indigo-300
                                        "
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Remember / Forgot */}
                            <div className="flex items-center justify-between text-xs">
                                <label className="flex cursor-pointer items-center text-gray-600 dark:text-gray-400">
                                    <input
                                        type="checkbox"
                                        className="
                                            h-3.5
                                            w-3.5
                                            rounded
                                            border-gray-300
                                            bg-white
                                            text-indigo-600
                                            focus:ring-indigo-500
                                            dark:border-gray-700
                                            dark:bg-gray-800
                                        "
                                    />

                                    <span className="ml-2">
                                        Remember me
                                    </span>
                                </label>

                                <a
                                    href="#forgot"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Sign In */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="
                                    flex
                                    w-full
                                    cursor-pointer
                                    justify-center
                                    rounded-lg
                                    bg-indigo-600
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-md
                                    transition-colors
                                    hover:bg-indigo-500
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-indigo-500
                                    focus:ring-offset-1
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:bg-indigo-500
                                    dark:hover:bg-indigo-600
                                    dark:focus:ring-offset-gray-900
                                "
                            >
                                Sign in
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400 dark:bg-gray-900 dark:text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="mb-3 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="
                                    inline-flex
                                    w-full
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-gray-700
                                    shadow-sm
                                    transition-colors
                                    hover:bg-gray-100
                                    dark:border-gray-700
                                    dark:bg-gray-800
                                    dark:text-gray-200
                                    dark:hover:bg-gray-700
                                "
                            >
                                Google
                            </button>

                            <button
                                type="button"
                                className="
                                    inline-flex
                                    w-full
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-gray-700
                                    shadow-sm
                                    transition-colors
                                    hover:bg-gray-100
                                    dark:border-gray-700
                                    dark:bg-gray-800
                                    dark:text-gray-200
                                    dark:hover:bg-gray-700
                                "
                            >
                                GitHub
                            </button>
                        </div>

                        {/* Register Link */}
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Sign up now
                            </a>
                        </p>
                    </div>
                </div>

                {/* Image Section */}
                <div
                    className="
                        order-1
                        relative
                        h-44
                        w-full
                        shrink-0
                        overflow-hidden
                        rounded-2xl
                        shadow-xl
                        sm:h-52
                        lg:order-2
                        lg:h-full
                        lg:w-1/2
                        lg:rounded-3xl
                        lg:shadow-2xl
                    "
                >
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7PDpxrRn_EvX1KwMiCmK40XfxKQhzldMLHYT9VOKrEA&s=10"
                        alt="Team collaborating in office"
                        className="h-full w-full object-cover"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-black/5 dark:bg-black/30" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;