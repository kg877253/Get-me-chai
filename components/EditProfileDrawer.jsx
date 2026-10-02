"use client"
import React, { useState, useEffect } from 'react'

const inputClass = "w-full bg-[#1a2333] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 placeholder:text-gray-500 transition"
const labelClass = "block text-sm text-gray-300 mb-1.5"

const EditProfileDrawer = ({ open, form, onClose, onSave }) => {
    const [localForm, setLocalForm] = useState(form)
    const [saving, setSaving] = useState(false)

    // Drawer khulte waqt latest form data load karo
    useEffect(() => {
        if (open) setLocalForm(form)
    }, [open, form])

    // Esc se band ho jaye
    useEffect(() => {
        if (!open) return
        const onKey = (e) => e.key === "Escape" && onClose()
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [open, onClose])

    const handleChange = (e) => {
        setLocalForm({ ...localForm, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        const formData = new FormData()
        Object.entries(localForm).forEach(([key, value]) => formData.append(key, value || ""))
        await onSave(formData)
        setSaving(false)
        onClose()
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#111826] border-l border-white/10 z-50 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#111826] z-10">
                    <h3 className="text-lg font-bold text-white">Edit Profile</h3>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition p-1.5 hover:bg-white/5 rounded-lg cursor-pointer"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className={labelClass}>Name</label>
                        <input type="text" name="name" value={localForm.name} onChange={handleChange} placeholder="Your full name" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Username</label>
                        <input type="text" name="username" value={localForm.username} onChange={handleChange} placeholder="username" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Profile Picture URL</label>
                        <input type="text" name="profilepic" value={localForm.profilepic} onChange={handleChange} placeholder="https://..." className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Cover Picture URL</label>
                        <input type="text" name="coverpic" value={localForm.coverpic} onChange={handleChange} placeholder="https://..." className={inputClass} />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <p className="text-sm font-semibold text-gray-300 mb-3">Razorpay Credentials</p>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Key ID</label>
                                <input type="text" name="razorpayid" value={localForm.razorpayid} onChange={handleChange} placeholder="rzp_test_xxxx" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Key Secret</label>
                                <input type="password" name="razorpaysecret" onChange={handleChange} placeholder="•••••••• (leave blank to keep current)" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg cursor-pointer transition active:scale-[0.98]"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default EditProfileDrawer