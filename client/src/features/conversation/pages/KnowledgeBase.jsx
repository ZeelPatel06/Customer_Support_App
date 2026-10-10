import { useRef, useState } from "react";
import {
    Database,
    FileText,
    CheckCircle2,
    XCircle,
    Clock3,
    Plus,
    Upload,
    Type,
    X,
    Pencil,
    Trash2,
    Eye
} from "lucide-react";
import toast from "react-hot-toast";

import { useKnowledgeSources } from "../hooks/useKnowledgeSources.js";
import {
    useKnowledgeUpload,
    useAddManualText,
    useUpdateKnowledgeSource,
    useDeleteKnowledgeSource,
    useUpdateManualText,
    useManualKnowledgeContent
} from "../hooks/useKnowledgeUpload.js";

import { useKnowledgeChunks } from "../hooks/useKnowledgeChunks.js";

const KnowledgeBase = () => {
    const {
        data,
        isLoading,
        isError,
    } = useKnowledgeSources();

    const {
        mutate: uploadDocument,
        isPending: isUploading,
    } = useKnowledgeUpload();

    const {
        mutate: addManualText,
        isPending: isAddingText,
    } = useAddManualText();

    const {
        mutate: getManualKnowledgeContent,
        isPending: isLoadingManualContent,
    } = useManualKnowledgeContent();

    const {
        mutate: updateKnowledgeSource,
        isPending: isUpdating,
    } = useUpdateKnowledgeSource();

    const {
        mutate: updateManualText,
        isPending: isUpdatingManualText,
    } = useUpdateManualText();

    const {
        mutate: deleteKnowledgeSource,
        isPending: isDeleting,
    } = useDeleteKnowledgeSource();

    const fileInputRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("document");

    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState("");

    // Chunks State
    const [showChunksModal, setShowChunksModal] = useState(false);
    const [selectedSource, setSelectedSource] = useState(null);

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSource, setEditingSource] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const sources = data?.data || [];

    const isSubmitting = isUploading || isAddingText;

    const {
        data: chunksData,
        isLoading: chunksLoading,
        isError: chunksError
    } = useKnowledgeChunks(selectedSource?._id);

    const resetForm = () => {
        setTitle("");
        setSelectedFile(null);
        setText("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const closeModal = () => {
        if (isSubmitting) return;

        setShowModal(false);
        resetForm();
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "ready":
                return {
                    label: "Ready",
                    className:
                        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                    icon: CheckCircle2,
                };

            case "failed":
                return {
                    label: "Failed",
                    className:
                        "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                    icon: XCircle,
                };

            case "processing":
                return {
                    label: "Processing",
                    className:
                        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                    icon: Clock3,
                };

            default:
                return {
                    label: status || "Unknown",
                    className:
                        "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400",
                    icon: FileText,
                };
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);

        if (!title.trim()) {
            const fileNameWithoutExtension = file.name.replace(
                /\.[^/.]+$/,
                ""
            );

            setTitle(fileNameWithoutExtension);
        }
    };

    const handleDocumentSubmit = (event) => {
        event.preventDefault();

        if (!selectedFile) {
            toast.error("Please select a document.");
            return;
        }

        if (!title.trim()) {
            toast.error("Please enter a title.");
            return;
        }

        const formData = new FormData();

        formData.append("title", title.trim());
        formData.append("file", selectedFile);

        uploadDocument(formData, {
            onSuccess: () => {
                toast.success("Document uploaded successfully.");
                closeModal();
            },

            onError: (error) => {
                const message =
                    error?.response?.data?.message ||
                    "Failed to upload document.";

                toast.error(message);
            },
        });
    };

    const handleManualTextSubmit = (event) => {
        event.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a title.");
            return;
        }

        if (!text.trim()) {
            toast.error("Please enter some text.");
            return;
        }

        addManualText(
            {
                title: title.trim(),
                content: text.trim(),
            },
            {
                onSuccess: () => {
                    toast.success("Text added successfully.");
                    closeModal();
                },

                onError: (error) => {
                    const message =
                        error?.response?.data?.message ||
                        "Failed to add text.";

                    toast.error(message);
                },
            }
        );
    };

    // -----------------------------
    // Edit
    // -----------------------------

    const handleEditClick = (source) => {
        setEditingSource(source);
        setEditTitle(source.title || "");

        // Uploaded document
        if (source.sourceType !== "text") {
            setEditContent("");
            setShowEditModal(true);
            return;
        }

        // Manual text
        setEditContent("");
        setShowEditModal(true);

        getManualKnowledgeContent(source._id, {
            onSuccess: (response) => {
                setEditContent(
                    response?.data?.content || ""
                );
            },

            onError: (error) => {
                const message =
                    error?.response?.data?.message ||
                    "Failed to load manual content.";

                toast.error(message);

                closeEditModal();
            },
        });
    };

    const closeEditModal = () => {
        if (isUpdating || isUpdatingManualText) {
            return;
        }

        setShowEditModal(false);
        setEditingSource(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleUpdateSource = (event) => {
        event.preventDefault();

        if (!editingSource) {
            return;
        }

        if (!editTitle.trim()) {
            toast.error("Title is required.");
            return;
        }

        // --------------------------------
        // Manual text
        // --------------------------------

        if (editingSource.sourceType === "text") {
            if (!editContent.trim()) {
                toast.error("Content is required.");
                return;
            }

            updateManualText(
                {
                    id: editingSource._id,
                    payload: {
                        title: editTitle.trim(),
                        content: editContent.trim(),
                    },
                },
                {
                    onSuccess: () => {
                        toast.success(
                            "Manual knowledge updated successfully."
                        );

                        closeEditModal();
                    },

                    onError: (error) => {
                        const message =
                            error?.response?.data?.message ||
                            "Failed to update manual knowledge.";

                        toast.error(message);
                    },
                }
            );

            return;
        }

        // --------------------------------
        // Uploaded document
        // --------------------------------

        updateKnowledgeSource(
            {
                id: editingSource._id,
                payload: {
                    title: editTitle.trim(),
                },
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Knowledge source updated successfully."
                    );

                    closeEditModal();
                },

                onError: (error) => {
                    const message =
                        error?.response?.data?.message ||
                        "Failed to update knowledge source.";

                    toast.error(message);
                },
            }
        );
    };

    // -----------------------------
    // Delete
    // -----------------------------

    const handleDeleteClick = (source) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${source.title}"? This will also delete its knowledge chunks.`
        );

        if (!confirmed) {
            return;
        }

        deleteKnowledgeSource(source._id, {
            onSuccess: () => {
                toast.success("Knowledge source deleted successfully.");
            },

            onError: (error) => {
                const message =
                    error?.response?.data?.message ||
                    "Failed to delete knowledge source.";

                toast.error(message);
            },
        });
    };

    // Chunks Handlers
    const handleViewChunks = (source) => {
        setSelectedSource(source);
        setShowChunksModal(true);
    };

    const closeChunksModal = () => {
        setShowChunksModal(false);
        setSelectedSource(null);
    }

    return (
        <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                            <Database
                                size={22}
                                className="text-indigo-600 dark:text-indigo-400"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                                Knowledge Base
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage the information your AI assistant uses
                                to answer customer questions.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto"
                    >
                        <Plus size={18} />
                        Add Knowledge
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />

                        <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
                            Loading knowledge sources...
                        </p>
                    </div>
                )}

                {/* Error */}
                {isError && !isLoading && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
                        <XCircle
                            size={28}
                            className="mx-auto text-red-500"
                        />

                        <h2 className="mt-3 text-base font-semibold text-red-700 dark:text-red-400">
                            Failed to load knowledge sources
                        </h2>

                        <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/70">
                            Please try again later.
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && sources.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <Database
                            size={38}
                            className="mx-auto text-gray-300 dark:text-slate-600"
                        />

                        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                            No knowledge sources yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-slate-400">
                            Add documents or business information to give your
                            AI assistant the knowledge it needs.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                        >
                            <Plus size={17} />
                            Add Knowledge
                        </button>
                    </div>
                )}

                {/* Sources */}
                {!isLoading && !isError && sources.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sources.map((source) => {
                            const status = getStatusStyles(source.status);
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={source._id}
                                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {/* Source Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-1">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                                                <FileText
                                                    size={19}
                                                    className="text-indigo-600 dark:text-indigo-400"
                                                />
                                            </div>

                                            <div className="w-fit">
                                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white shrink">
                                                    {source.title}
                                                </h2>

                                                <p className="mt-1 text-xs uppercase tracking-wide text-gray-400 dark:text-slate-500">
                                                    {source.sourceType}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEditClick(source)
                                                }
                                                disabled={isUpdating || isDeleting}
                                                title="Edit source"
                                                className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteClick(source)
                                                }
                                                disabled={isDeleting || isUpdating}
                                                title="Delete source"
                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleViewChunks(source)}
                                                className="cursor-pointer px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 transition"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="mt-5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                                        >
                                            <StatusIcon size={14} />
                                            {status.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Knowledge Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Add Knowledge
                                </h2>

                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                    Add information for your AI assistant.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="rounded-lg p-2 cursor-pointer text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="grid grid-cols-2 gap-2 p-5 pb-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab("document")}
                                disabled={isSubmitting}
                                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${activeTab === "document"
                                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400"
                                    : "border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <Upload size={17} />
                                Document
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("text")}
                                disabled={isSubmitting}
                                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${activeTab === "text"
                                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400"
                                    : "border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <Type size={17} />
                                Manual Text
                            </button>
                        </div>

                        {/* Document Form */}
                        {activeTab === "document" && (
                            <form
                                onSubmit={handleDocumentSubmit}
                                className="space-y-4 px-5 pb-5"
                            >
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        placeholder="e.g. Refund Policy"
                                        disabled={isSubmitting}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                        Document
                                    </label>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx,.xlsx,.txt,.csv"
                                        onChange={handleFileChange}
                                        disabled={isSubmitting}
                                        className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-sm text-gray-500 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-300 hover:file:text-black disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:file:bg-indigo-950/40 dark:file:text-indigo-400"
                                    />

                                    <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                                        Supported: PDF, DOCX, XLSX, TXT, CSV
                                    </p>
                                </div>

                                {selectedFile && (
                                    <div className="rounded-xl bg-gray-50 px-3.5 py-3 text-sm dark:bg-slate-800">
                                        <p className="font-medium text-gray-700 dark:text-slate-300">
                                            Selected file
                                        </p>

                                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-slate-400">
                                            {selectedFile.name}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={17} />
                                            Upload Document
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Manual Text Form */}
                        {activeTab === "text" && (
                            <form
                                onSubmit={handleManualTextSubmit}
                                className="space-y-4 px-5 pb-5"
                            >
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        placeholder="e.g. Company Information"
                                        disabled={isSubmitting}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                        Content
                                    </label>

                                    <textarea
                                        value={text}
                                        onChange={(event) =>
                                            setText(event.target.value)
                                        }
                                        placeholder="Enter your business information here..."
                                        rows={8}
                                        disabled={isSubmitting}
                                        className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isAddingText ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Type size={17} />
                                            Add Text
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Knowledge Source Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Edit Knowledge Source
                                </h2>

                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                    Update the source title.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={isUpdating}
                                className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateSource}
                            className="space-y-4 px-5 py-5"
                        >
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(event) =>
                                        setEditTitle(event.target.value)
                                    }
                                    disabled={isUpdating}
                                    autoFocus
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                            </div>
                            {editingSource?.sourceType === "text" && (
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                                        Content
                                    </label>

                                    {isLoadingManualContent ? (
                                        <div className="flex min-h-55 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                                                Loading content...
                                            </div>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={editContent}
                                            onChange={(event) =>
                                                setEditContent(event.target.value)
                                            }
                                            placeholder="Enter your knowledge content..."
                                            rows={10}
                                            disabled={
                                                isUpdating ||
                                                isUpdatingManualText
                                            }
                                            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                                        />
                                    )}

                                    <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                                        Updating the content will regenerate its knowledge chunks and embeddings.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={isUpdating}
                                    className="cursor-pointer flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isUpdating ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Pencil size={16} />
                                            Update
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showChunksModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Knowledge Chunks
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    {selectedSource?.title}
                                </p>
                            </div>

                            <button
                                onClick={closeChunksModal}
                                className="rounded-lg p-2 cursor-pointer text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden p-6">
                            {chunksLoading && (
                                <div className="flex justify-center py-10">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600" />
                                </div>
                            )}

                            {chunksError && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-red-600 dark:text-red-400">
                                    Failed to load knowledge chunks.
                                </div>
                            )}

                            {!chunksLoading &&
                                !chunksError &&
                                chunksData?.data?.length === 0 && (
                                    <div className="py-10 text-center text-slate-500">
                                        No chunks found for this knowledge source.
                                    </div>
                                )}

                            {!chunksLoading &&
                                !chunksError &&
                                chunksData?.data?.length > 0 && (
                                    <div className="space-y-4">
                                        {chunksData.data.map((chunk, index) => (
                                            <div
                                                key={chunk._id || index}
                                                className="w-full min-w-0 rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                        Chunk #{chunk.chunkIndex + 1}
                                                    </span>
                                                </div>

                                                <p className="w-full min-w-0 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700 dark:text-slate-300">
                                                    {chunk.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeBase;