import { useEffect, useMemo, useState } from "react";
import {
    Bot,
    Check,
    Copy,
    Eye,
    KeyRound,
    ShieldAlert,
    ShieldCheck,
    Terminal,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
    useAllowedOrigins,
    useAddAllowedOrigin,
    useRemoveAllowedOrigin,
} from "../hooks/useAllowedOrigin.js";

import {
    useOrganizationCredentials,
    useGenerateOrganizationCredentials,
    useRevokeOrganizationCredentials,
} from "../hooks/useOrgCredits.js";

const ChabotWidgetCard = () => {
    const [environment, setEnvironment] = useState("test");

    const [newOrigin, setNewOrigin] = useState("");
    const [originError, setOriginError] = useState("");

    const [showCredentialsModal, setShowCredentialsModal] =
        useState(false);

    const [generatedCredentials, setGeneratedCredentials] =
        useState(null);

    const [showRevokeModal, setShowRevokeModal] = useState(false);

    const [copiedField, setCopiedField] = useState(null);

    const {
        data,
        isLoading,
        refetch,
    } = useOrganizationCredentials();

    const generateCredentials =
        useGenerateOrganizationCredentials();

    const revokeCredentials =
        useRevokeOrganizationCredentials();

    const {
        data: allowedOriginsData,
        isLoading: isLoadingOrigins,
    } = useAllowedOrigins();

    const addAllowedOrigin =
        useAddAllowedOrigin();

    const removeAllowedOrigin =
        useRemoveAllowedOrigin();

    const allowedOrigins =
        allowedOriginsData?.data || [];

    // ---------------------------------------------------------
    // Normalize API response
    // ---------------------------------------------------------

    const getCredentialFromResponse = (response, selectedEnvironment) => {
        if (!response) return null;

        const raw =
            response?.data ??
            response?.credentials ??
            response;

        // If API returns an array
        if (Array.isArray(raw)) {
            return (
                raw.find(
                    (credential) =>
                        credential?.environment ===
                        selectedEnvironment &&
                        credential?.status === "active"
                ) ||
                raw.find(
                    (credential) =>
                        credential?.environment ===
                        selectedEnvironment
                ) ||
                null
            );
        }

        // If API returns:
        // { data: { credentials: [...] } }
        if (Array.isArray(raw?.credentials)) {
            return (
                raw.credentials.find(
                    (credential) =>
                        credential?.environment ===
                        selectedEnvironment &&
                        credential?.status === "active"
                ) ||
                raw.credentials.find(
                    (credential) =>
                        credential?.environment ===
                        selectedEnvironment
                ) ||
                null
            );
        }

        // If API returns a single credential
        if (
            raw?.environment &&
            raw.environment !== selectedEnvironment
        ) {
            return null;
        }

        return raw;
    };

    const normalizeOrigin = (value) => {

        const trimmedValue = value.trim();

        if (!trimmedValue) {
            throw new Error("Website origin is required");
        }

        let url;

        try {
            url = new URL(trimmedValue);
        } catch {
            throw new Error("Enter a valid website URL");
        }

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {
            throw new Error(
                "Only HTTP and HTTPS websites are allowed"
            );
        }

        if (
            url.pathname !== "/" &&
            url.pathname !== ""
        ) {
            throw new Error(
                "Enter only the website origin, for example https://example.com"
            );
        }

        if (url.search || url.hash) {
            throw new Error(
                "Website URL must not contain query parameters or hash"
            );
        }

        return url.origin;
    };

    // ---------------------------------------------------------
    // Current credential
    // ---------------------------------------------------------

    const currentCredentials = useMemo(() => {
        return getCredentialFromResponse(
            data,
            environment
        );
    }, [data, environment]);

    // ---------------------------------------------------------
    // Generated credential takes priority immediately after
    // generation.
    // ---------------------------------------------------------

    const credentials =
        generatedCredentials || currentCredentials;

    const publicKey = credentials?.publicKey || null;

    const isActive =
        !!publicKey &&
        (
            credentials?.status === "active" ||
            !!generatedCredentials
        );

    // ---------------------------------------------------------
    // Embed code
    // ---------------------------------------------------------

    const embedCode = publicKey
        ? `<script
    src="http://localhost:5000/chatbot.js"
    data-public-key="${publicKey}">
</script>`
        : "";

    // ---------------------------------------------------------
    // When environment changes
    // ---------------------------------------------------------

    useEffect(() => {
        setGeneratedCredentials(null);
        setShowCredentialsModal(false);
        setCopiedField(null);
    }, [environment]);

    // ---------------------------------------------------------
    // Generate credentials
    // ---------------------------------------------------------

    const handleGenerateCredentials = () => {
        generateCredentials.mutate(environment, {
            onSuccess: async (response) => {
                const generated =
                    getCredentialFromResponse(
                        response,
                        environment
                    );

                if (!generated?.publicKey) {
                    toast.error(
                        "Credentials generated, but response was invalid."
                    );

                    await refetch();
                    return;
                }

                /*
                 * Keep the generated credentials in local state.
                 *
                 * This immediately changes the UI from:
                 *
                 * Generate Credentials
                 *
                 * to:
                 *
                 * Public Key
                 * Installation Code
                 * View Credentials
                 * Revoke Keys
                 */
                setGeneratedCredentials(generated);

                setShowCredentialsModal(true);

                toast.success(
                    "Credentials generated successfully"
                );

                await refetch();
            },

            onError: (error) => {
                const message =
                    error?.response?.data?.message ||
                    "Failed to generate credentials";

                toast.error(message);
            },
        });
    };

    // ---------------------------------------------------------
    // Revoke credentials
    // ---------------------------------------------------------

    const handleRevokeCredentials = () => {
        const credentialId =
            credentials?._id ||
            credentials?.id;

        if (!credentialId) {
            toast.error("Credential ID not found");
            return;
        }

        revokeCredentials.mutate(credentialId, {
            onSuccess: async () => {
                setGeneratedCredentials(null);
                setShowCredentialsModal(false);
                setCopiedField(null);

                toast.success(
                    "Credentials revoked successfully"
                );

                await refetch();
            },

            onError: (error) => {
                const message =
                    error?.response?.data?.message ||
                    "Failed to revoke credentials";

                toast.error(message);
            },
        });
    };

    // ---------------------------------------------------------
    // Copy
    // ---------------------------------------------------------

    const handleCopy = async (value, field) => {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);

            setCopiedField(field);

            toast.success("Copied to clipboard");

            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    // ---------------------------------------------------------
    // Allowed Origin
    // ---------------------------------------------------------

    const handleAddOrigin = () => {

        setOriginError("");

        try {

            const origin =
                normalizeOrigin(newOrigin);

            addAllowedOrigin.mutate(origin, {
                onSuccess: () => {
                    setNewOrigin("");
                    toast.success(
                        "Website added successfully"
                    );
                },

                onError: (error) => {

                    const message =
                        error?.response?.data?.message ||
                        "Failed to add website";

                    setOriginError(message);
                },
            });

        } catch (error) {

            setOriginError(error.message);
        }
    };

    // ---------------------------------------------------------
    // Remove Origin
    // ---------------------------------------------------------

    const handleRemoveOrigin = (origin) => {

        removeAllowedOrigin.mutate(origin, {
            onSuccess: () => {

                toast.success(
                    "Website removed successfully"
                );
            },

            onError: (error) => {

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to remove website"
                );
            },
        });
    };

    // ---------------------------------------------------------
    // Loading
    // ---------------------------------------------------------

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 w-48 rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
        );
    }

    return (
        <>
            {/* =====================================================
                MAIN CARD
            ====================================================== */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Bot size={22} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Connect your website
                            </h2>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Generate credentials to get the
                                installation code for your chatbot.
                            </p>
                        </div>

                    </div>

                    {/* Environment */}

                    <div className="flex items-center gap-2">

                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Environment
                        </span>

                        <select
                            value={environment}
                            onChange={(e) =>
                                setEnvironment(
                                    e.target.value
                                )
                            }
                            className="cursor-pointer h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="test">
                                Test
                            </option>

                            <option value="live">
                                Live
                            </option>
                        </select>

                    </div>

                </div>

                {/* =================================================
                    NO CREDENTIALS
                ================================================== */}

                {!isActive && (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950/40">

                        <div className="mx-auto max-w-lg text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <KeyRound size={21} />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                                No {environment} credentials yet
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Generate your{" "}
                                {environment} credentials
                                to connect the AI chatbot
                                to your website.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    handleGenerateCredentials
                                }
                                disabled={
                                    generateCredentials.isPending
                                }
                                className="cursor-pointer mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <KeyRound size={16} />

                                {generateCredentials.isPending
                                    ? "Generating..."
                                    : "Generate Credentials"}
                            </button>

                        </div>

                    </div>
                )}

                {/* =================================================
                    ACTIVE CREDENTIALS
                ================================================== */}

                {isActive && publicKey && (
                    <div className="mt-6 space-y-5">

                        {/* Active Status */}

                        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-500/10">

                            <div className="flex items-center gap-3">

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                    <ShieldCheck size={17} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                                        Credentials active
                                    </p>

                                    <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                                        Your{" "}
                                        {environment} chatbot
                                        connection is ready
                                        to use.
                                    </p>
                                </div>

                            </div>

                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                ACTIVE
                            </span>

                        </div>

                        {/* =================================================
                            PUBLIC KEY
                        ================================================== */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Public Key
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Safe to use in your
                                        website.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            publicKey,
                                            "publicKey"
                                        )
                                    }
                                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {copiedField ===
                                        "publicKey" ? (
                                        <Check size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}

                                    {copiedField ===
                                        "publicKey"
                                        ? "Copied"
                                        : "Copy"}
                                </button>

                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">

                                <code className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300">
                                    {publicKey}
                                </code>

                            </div>

                        </div>

                        {/* =================================================
                            EMBED CODE
                        ================================================== */}

                        <div>

                            <div className="mb-2 flex items-start justify-between gap-3">

                                <div>
                                    <div className="flex items-center gap-2">

                                        <Terminal
                                            size={16}
                                            className="text-indigo-500"
                                        />

                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Installation Code
                                        </p>

                                    </div>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Add this code before
                                        the closing{" "}
                                        <span className="mx-1 rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">
                                            &lt;/body&gt;
                                        </span>{" "}
                                        tag of your website.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            embedCode,
                                            "embedCode"
                                        )
                                    }
                                    className="cursor-pointer inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {copiedField ===
                                        "embedCode" ? (
                                        <Check size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}

                                    {copiedField ===
                                        "embedCode"
                                        ? "Copied"
                                        : "Copy"}
                                </button>

                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">

                                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">

                                    <div className="flex gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                                    </div>

                                    <span className="ml-1 text-[11px] text-slate-500">
                                        HTML
                                    </span>

                                </div>

                                <pre className="overflow-x-auto p-4 text-xs leading-6">
                                    <code className="text-slate-300">
                                        {embedCode}
                                    </code>
                                </pre>

                            </div>

                        </div>

                        {/* =================================================
                            ACTION BUTTONS
                        ================================================== */}

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCredentialsModal(
                                        true
                                    )
                                }
                                className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Eye size={16} />

                                View Credentials
                            </button>

                            <button
                                type="button"
                                onClick={
                                    () => setShowRevokeModal(true)
                                }
                                disabled={
                                    revokeCredentials.isPending
                                }
                                className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                                <Trash2 size={16} />
                                Revoke Keys
                            </button>

                        </div>

                        {/* =================================================
                            WARNING
                        ================================================== */}

                        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-500/10">

                            <ShieldAlert
                                size={18}
                                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                            />

                            <div>

                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                    Important
                                </p>

                                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                                    Revoking these credentials
                                    will disable this chatbot
                                    connection. Websites using
                                    these keys will no longer be
                                    able to create widget sessions.
                                    Generate new credentials to
                                    reconnect your website.
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {/* Allowed Websites */}

                <div className="mt-6 border-t border-gray-200 pt-6 dark:border-slate-800">

                    <div className="flex items-start justify-between gap-4">

                        <div>

                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                Allowed Websites
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-slate-400">
                                Only these websites can use your chatbot.
                            </p>

                        </div>

                    </div>


                    {/* Add Website */}

                    <div className="mt-4">

                        <div className="flex flex-col gap-2 sm:flex-row">

                            <input
                                type="text"
                                value={newOrigin}
                                onChange={(e) => {
                                    setNewOrigin(e.target.value);
                                    setOriginError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddOrigin();
                                    }
                                }}
                                placeholder="https://example.com"
                                className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-500/10
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                "
                            />

                            <button
                                type="button"
                                onClick={handleAddOrigin}
                                disabled={
                                    addAllowedOrigin.isPending ||
                                    !newOrigin.trim()
                                }
                                className="
                    inline-flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-indigo-600
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-indigo-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                            >
                                {addAllowedOrigin.isPending
                                    ? "Adding..."
                                    : "Add Website"}
                            </button>

                        </div>


                        {originError && (
                            <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                                {originError}
                            </p>
                        )}

                    </div>


                    {/* Website List */}

                    <div className="mt-4">

                        {isLoadingOrigins ? (

                            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                Loading allowed websites...
                            </div>

                        ) : allowedOrigins.length === 0 ? (

                            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center dark:border-slate-700 dark:bg-slate-950">

                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                    No websites added yet
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                                    Add your website above to allow the chatbot to work there.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-2">

                                {allowedOrigins.map((origin) => (

                                    <div
                                        key={origin}
                                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-3
                            py-3
                            dark:border-slate-800
                            dark:bg-slate-950
                        "
                                    >

                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-200">
                                                {origin}
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveOrigin(origin)
                                            }
                                            disabled={
                                                removeAllowedOrigin.isPending
                                            }
                                            className="
                                shrink-0
                                cursor-pointer
                                rounded-lg
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-red-600
                                transition
                                hover:bg-red-50
                                disabled:opacity-50
                                dark:text-red-400
                                dark:hover:bg-red-950/30
                            "
                                        >
                                            Remove
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>
            </div>

            {/* =========================================================
                CREDENTIAL MODAL
            ========================================================== */}

            {showCredentialsModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setShowCredentialsModal(false)
                    }
                >

                    <div
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Header */}

                        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <KeyRound size={19} />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                        {environment ===
                                            "test"
                                            ? "Test"
                                            : "Live"}{" "}
                                        Credentials
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Keep your secret key
                                        private.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCredentialsModal(
                                        false
                                    )
                                }
                                className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* Body */}

                        <div className="space-y-5 p-6">

                            {/* Public Key */}

                            <div>

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Public Key
                                </label>

                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">

                                    <code className="min-w-0 flex-1 overflow-x-auto wrap-break-word text-xs text-slate-700 dark:text-slate-300">
                                        {credentials?.publicKey}
                                    </code>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                credentials?.publicKey,
                                                "modalPublicKey"
                                            )
                                        }
                                        className="cursor-pointer shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-800"
                                    >
                                        {copiedField ===
                                            "modalPublicKey" ? (
                                            <Check size={15} />
                                        ) : (
                                            <Copy size={15} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Secret Key */}

                            <div>

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Secret Key
                                </label>

                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-500/10">

                                    <div className="flex items-start gap-2">

                                        <ShieldAlert
                                            size={16}
                                            className="mt-0.5 shrink-0 text-red-500"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="mb-2 text-xs font-semibold text-red-700 dark:text-red-400">
                                                Keep this key private
                                            </p>

                                            <code className="block break-all text-xs leading-5 text-red-700 dark:text-red-300">
                                                {generatedCredentials?.secretKey ||
                                                    "The secret key is only available immediately after generation."}
                                            </code>

                                        </div>

                                        {generatedCredentials?.secretKey && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopy(
                                                        generatedCredentials.secretKey,
                                                        "secretKey"
                                                    )
                                                }
                                                className="cursor-pointer shrink-0 rounded-lg p-2 text-red-500 transition hover:bg-red-100 dark:hover:bg-red-500/20"
                                            >
                                                {copiedField ===
                                                    "secretKey" ? (
                                                    <Check size={15} />
                                                ) : (
                                                    <Copy size={15} />
                                                )}
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* Security Notice */}

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">

                                <div className="flex gap-3">

                                    <ShieldCheck
                                        size={17}
                                        className="mt-0.5 shrink-0 text-emerald-500"
                                    />

                                    <div>

                                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                            Security notice
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                            The secret key is shown
                                            only when credentials are
                                            generated. Store it
                                            somewhere secure before
                                            closing this window.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowCredentialsModal(
                                        false
                                    );

                                    /*
                                     * Important:
                                     * Secret key disappears from
                                     * React state after closing.
                                     */
                                    setGeneratedCredentials(
                                        null
                                    );

                                    setCopiedField(null);
                                }}
                                className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                Done
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* REVOKE CONFIRMATION MODAL */}
            {showRevokeModal && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() => setShowRevokeModal(false)}
                >
                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}

                        <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                <ShieldAlert size={21} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                    Revoke {environment === "test" ? "Test" : "Live"} Keys?
                                </h3>

                                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                                    This action will disable the current chatbot
                                    credentials.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowRevokeModal(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* Body */}

                        <div className="space-y-4 p-6">

                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-500/10">

                                <div className="flex gap-3">

                                    <ShieldAlert
                                        size={18}
                                        className="mt-0.5 shrink-0 text-red-500"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                            This action cannot be undone
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                                            Once these keys are revoked, the current
                                            chatbot integration will stop working.
                                            Any website using these credentials will
                                            no longer be able to create widget sessions.
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                You can generate new credentials after revoking these
                                keys, but the old keys will no longer be usable.
                            </p>

                        </div>

                        {/* Footer */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-800">

                            <button
                                type="button"
                                onClick={() => setShowRevokeModal(false)}
                                disabled={revokeCredentials.isPending}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    handleRevokeCredentials();
                                    setShowRevokeModal(false);
                                }}
                                disabled={revokeCredentials.isPending}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Trash2 size={16} />

                                {revokeCredentials.isPending
                                    ? "Revoking..."
                                    : "Yes, Revoke Keys"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ChabotWidgetCard;