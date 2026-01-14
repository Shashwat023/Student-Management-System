"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/features/admin/header"
import { Settings, User, Bell, Shield, Database, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminSettingsPage() {
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        // Simulate save
        setTimeout(() => setSaving(false), 1000)
    }

    return (
        <div className="min-h-screen bg-[#0f172a]">
            <AdminHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Settings className="h-8 w-8 text-orange-400" />
                        <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Settings Navigation */}
                        <Card className="p-6 bg-[#1e293b] border-slate-700 h-fit">
                            <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
                            <nav className="space-y-2">
                                {[
                                    { icon: User, label: "Profile", active: true },
                                    { icon: Bell, label: "Notifications", active: false },
                                    { icon: Shield, label: "Security", active: false },
                                    { icon: Database, label: "Data Management", active: false },
                                    { icon: Mail, label: "Email Settings", active: false },
                                ].map((item, index) => (
                                    <button
                                        key={index}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                                                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                                                : "text-slate-300 hover:bg-slate-700"
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </Card>

                        {/* Settings Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Settings */}
                            <Card className="p-8 bg-[#1e293b] border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                                            <Input
                                                id="name"
                                                defaultValue="Admin User"
                                                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue="admin@college.edu"
                                                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="department" className="text-slate-300">Department</Label>
                                            <Select defaultValue="cse">
                                                <SelectTrigger id="department" className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cse">Computer Science</SelectItem>
                                                    <SelectItem value="aids">AI & Data Science</SelectItem>
                                                    <SelectItem value="ece">Electronics</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                defaultValue="+91 98765 43210"
                                                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                                        <textarea
                                            id="bio"
                                            rows={4}
                                            defaultValue="Department administrator with 5+ years of experience in educational management."
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* System Preferences */}
                            <Card className="p-8 bg-[#1e293b] border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6">System Preferences</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="language" className="text-slate-300">Language</Label>
                                            <Select defaultValue="en">
                                                <SelectTrigger id="language" className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="hi">Hindi</SelectItem>
                                                    <SelectItem value="mr">Marathi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                                            <Select defaultValue="ist">
                                                <SelectTrigger id="timezone" className="bg-slate-800 border-slate-600 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                                                    <SelectItem value="utc">UTC</SelectItem>
                                                    <SelectItem value="est">EST (UTC-5)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                        <div>
                                            <p className="font-medium text-white">Email Notifications</p>
                                            <p className="text-sm text-slate-400">Receive email updates for important events</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600">
                                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                        <div>
                                            <p className="font-medium text-white">Auto-save Changes</p>
                                            <p className="text-sm text-slate-400">Automatically save form changes</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-600">
                                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            {/* Save Button */}
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
