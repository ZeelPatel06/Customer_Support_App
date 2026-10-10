import React, { useState } from "react";
import { useRegister } from "../hooks/useAuth.js";
import toast from "react-hot-toast";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        role: "user",
        organizationName: "",
        organizationWebsite: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const { mutate: register, isPending } = useRegister();

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

        const {
            name,
            email,
            password,
            contactNumber,
            role,
            organizationName,
            organizationWebsite,
        } = formData;

        if (
            !name ||
            !email ||
            !password ||
            !contactNumber ||
            !role ||
            !organizationName ||
            !organizationWebsite
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        register(formData, {
            onSuccess: () => {
                toast.success("Registration successful!");
            },

            onError: (err) => {
                const message =
                    err?.response?.data?.message ||
                    "Registration failed. Please try again.";

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
                {/* =========================
                    REGISTER FORM
                ========================== */}
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
                        px-4
                        py-5
                        shadow-xl
                        dark:border-gray-800
                        dark:bg-gray-900
                        lg:order-1
                        lg:h-full
                        lg:w-1/2
                        lg:px-8
                        lg:py-4
                    "
                >
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="mb-4">
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Create an Account
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Enter your personal and organization details
                                below.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="
                                    mb-3
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-2
                                    text-center
                                    text-xs
                                    font-medium
                                    text-red-600
                                    dark:border-red-900/50
                                    dark:bg-red-950/40
                                    dark:text-red-400
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Registration Form */}
                        <form
                            className="space-y-2.5"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {/* =========================
                                PERSONAL INFORMATION
                            ========================== */}

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Full Name *
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="
                                            mt-0.5
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            px-2.5
                                            py-1.5
                                            text-xs
                                            text-gray-900
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

                                {/* Role */}
                                <div>
                                    <label
                                        htmlFor="role"
                                        className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Role *
                                    </label>

                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="
                                            mt-0.5
                                            w-full
                                            cursor-pointer
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            px-2.5
                                            py-1.5
                                            text-xs
                                            text-gray-900
                                            outline-none
                                            focus:border-indigo-500
                                            focus:ring-2
                                            focus:ring-indigo-500/20
                                            dark:border-gray-700
                                            dark:bg-gray-800
                                            dark:text-white
                                        "
                                    >
                                        <option value="user">User</option>
                                        <option value="owner">Owner</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Email Address *
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@company.com"
                                        className="
                                            mt-0.5
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            px-2.5
                                            py-1.5
                                            text-xs
                                            text-gray-900
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

                                {/* Contact Number */}
                                <div>
                                    <label
                                        htmlFor="contactNumber"
                                        className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Contact Number *
                                    </label>

                                    <input
                                        id="contactNumber"
                                        name="contactNumber"
                                        type="tel"
                                        required
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        className="
                                            mt-0.5
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            px-2.5
                                            py-1.5
                                            text-xs
                                            text-gray-900
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
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                >
                                    Password *
                                </label>

                                <div className="relative mt-0.5">
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
                                            px-2.5
                                            py-1.5
                                            pr-12
                                            text-xs
                                            text-gray-900
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
                                            cursor-pointer
                                            items-center
                                            px-2.5
                                            text-[11px]
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

                            {/* =========================
                                ORGANIZATION INFORMATION
                            ========================== */}

                            <div className="pt-1">
                                <div className="relative mb-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                                    </div>

                                    <div className="relative flex">
                                        <span className="bg-white pr-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-gray-900 dark:text-indigo-400">
                                            Organization Information
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {/* Organization Name */}
                                    <div>
                                        <label
                                            htmlFor="organizationName"
                                            className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Org Name *
                                        </label>

                                        <input
                                            id="organizationName"
                                            name="organizationName"
                                            type="text"
                                            required
                                            value={
                                                formData.organizationName
                                            }
                                            onChange={handleChange}
                                            placeholder="Acme Corp"
                                            className="
                                                mt-0.5
                                                w-full
                                                rounded-lg
                                                border
                                                border-gray-300
                                                bg-white
                                                px-2.5
                                                py-1.5
                                                text-xs
                                                text-gray-900
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

                                    {/* Organization Website */}
                                    <div>
                                        <label
                                            htmlFor="organizationWebsite"
                                            className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Org Website *
                                        </label>

                                        <input
                                            id="organizationWebsite"
                                            name="organizationWebsite"
                                            type="url"
                                            required
                                            value={
                                                formData.organizationWebsite
                                            }
                                            onChange={handleChange}
                                            placeholder="https://acme.com"
                                            className="
                                                mt-0.5
                                                w-full
                                                rounded-lg
                                                border
                                                border-gray-300
                                                bg-white
                                                px-2.5
                                                py-1.5
                                                text-xs
                                                text-gray-900
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
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="
                                    mt-2
                                    flex
                                    w-full
                                    cursor-pointer
                                    justify-center
                                    rounded-lg
                                    bg-indigo-600
                                    py-2
                                    text-xs
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
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-3.5 w-3.5 animate-spin text-white"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>

                                        Registering...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        {/* Social Login Divider */}
                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-[10px] text-gray-400 dark:bg-gray-900 dark:text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="mb-2 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                className="
                                    inline-flex
                                    w-full
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    py-1.5
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
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    py-1.5
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

                        {/* Login Link */}
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* =========================
                    IMAGE SECTION
                ========================== */}
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

export default Register;