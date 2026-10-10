import React, { useState, useEffect } from 'react';
import { useAuthUser, useLogout, useUpdateProfile } from '../hooks/useAuth';
import { LogOut, TriangleAlert, Edit3, Save, X } from "lucide-react";
import AILoader from '../../Shared/AILoading';

export default function ProfilePage() {
    const { data: user, isLoading, isError, error } = useAuthUser();    
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    // Toggle for Edit mode
    const [isEditing, setIsEditing] = useState(false);

    // Form state initialized with empty strings
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        organizationName: '',
        organizationWebsite: '',
    });

    // Populate local form state when user data finishes loading or updates
    useEffect(() => {
        if (user?.user) {
            setFormData({
                name: user.user.name || '',
                email: user.user.email || '',
                contactNumber: user.user.contactNumber || '',
                organizationName: user.user.organizationId?.organizationName || '',
                organizationWebsite: user.user.organizationId?.organizationWebsite || '',
            });
            const localData = {
                name: user.user.name,
                role: user.user.role,
                organizationName: user.user.organizationId.organizationName,
            }
            localStorage.setItem("userData", JSON.stringify(localData));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateProfile(formData, {
            onSuccess: () => {
                setIsEditing(false); // Return to display mode on successful patch
            },
        });
        localStorage.setItem("userData", JSON.stringify(formData));
    };

    const rawWebsite = user?.user?.organizationId?.organizationWebsite;
    const linkHref = rawWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '#';

    if (isLoading) {
        return <AILoader />;
    }

    if (isError) {
        return (
            <div className='flex items-center justify-center py-50'>
                <div className="flex items-center flex-col gap-10 mx-auto max-w-lg rounded-xl bg-red-200 dark:bg-red-950/40 p-4 text-center text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                    <TriangleAlert size={50} />
                    <span>Failed to load profile details: {error?.response?.data?.message || error.message}</span>
                </div>
            </div>
        );
    }

    const userInitial = user?.user?.name ? user.user.name.charAt(0).toUpperCase() : 'U';

    return (
        <>
            <div className="max-w-5xl mx-auto px-5 pt-5">
                {/* Container Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-colors duration-200">

                    {/* Banner Section */}
                    <div className="h-30 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 sm:h-32"></div>

                    {/* Profile Content Body */}
                    <div className="relative px-6 pb-8 pt-6 sm:px-10">

                        {/* Avatar and Header Info */}
                        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-6">

                            <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4">
                                {/* Profile Avatar */}
                                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white dark:border-slate-900 bg-indigo-600 text-3xl font-extrabold text-white shadow-md sm:h-32 sm:w-32 sm:text-4xl">
                                    {userInitial}
                                </div>

                                {/* Basic Info */}
                                <div className="text-center sm:text-left sm:pt-4">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="text-xl font-bold bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border border-indigo-500 rounded-lg px-2 py-1 outline-none"
                                        />
                                    ) : (
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                                            {user?.user?.name || 'User Profile'}
                                        </h1>
                                    )}
                                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-1">
                                        {user?.user?.role || 'User'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons (Edit / Save / Cancel / Logout) */}
                            <div className="mt-4 sm:mt-0 flex items-center gap-2 sm:pb-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                        >
                                            <X size={16} /> Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={isUpdating}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                                        >
                                            <Save size={16} />
                                            {isUpdating ? "Saving..." : "Save"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors cursor-pointer"
                                        >
                                            <Edit3 size={16} /> Edit Profile
                                        </button>

                                        <button onClick={() => logout()} disabled={isLoggingOut} className="cursor-pointer">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/50 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/80 transition-colors">
                                                <LogOut size={16} />
                                                {isLoggingOut ? "Logging out..." : "Logout"}
                                            </span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <hr className="my-6 border-gray-100 dark:border-slate-800" />

                        {/* User Details Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                            {/* Personal Details */}
                            <div className="space-y-4 rounded-xl bg-gray-50/60 dark:bg-slate-800/50 p-5 border border-gray-100 dark:border-slate-800/80">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">
                                    Personal Information
                                </h2>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 block mb-1">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user?.user?.email || 'N/A'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 block mb-1">Contact Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            className="w-full text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user?.user?.contactNumber || 'N/A'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Organization Details */}
                            <div className="space-y-4 rounded-xl bg-gray-50/60 dark:bg-slate-800/50 p-5 border border-gray-100 dark:border-slate-800/80">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">
                                    Organization Details
                                </h2>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 block mb-1">Organization Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleChange}
                                            className="w-full text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                                            {user?.user?.organizationId?.organizationName || 'Not specified'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 block mb-1">Organization Website</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="organizationWebsite"
                                            value={formData.organizationWebsite}
                                            onChange={handleChange}
                                            className="w-full text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                            {rawWebsite ? (
                                                <a href={linkHref} target="_blank" rel="noopener noreferrer">
                                                    {rawWebsite}
                                                </a>
                                            ) : (
                                                'Not specified'
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}