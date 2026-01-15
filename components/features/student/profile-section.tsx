"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, GraduationCap, Award, Edit, Save, X } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileSectionProps {
  profile: {
    name: string
    rollNumber: string
    collegeEmail: string
    course: string
    branch: string
    cgpa: number
  }
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Add API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsEditing(false)
      // Show success message
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Card with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 overflow-hidden">
          <div className="p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-3xl font-bold bg-white/10 border-white/30 text-white placeholder:text-white/50 mb-2"
                      placeholder="Name"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-white mb-1">{formData.name}</h2>
                  )}
                  <p className="text-blue-100 text-lg">{formData.rollNumber}</p>
                </div>
              </div>

              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-500/20 border-green-400/30 text-white hover:bg-green-500/30 backdrop-blur-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-red-500/20 border-red-400/30 text-white hover:bg-red-500/30 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">College Email</label>
                  <p className="text-slate-200 font-medium">{formData.collegeEmail}</p>
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Academic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Academic Details</h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Course</label>
                    {isEditing ? (
                      <Input
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white mt-1"
                      />
                    ) : (
                      <p className="text-slate-200 font-medium">{formData.course}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Branch</label>
                    {isEditing ? (
                      <Input
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white mt-1"
                      />
                    ) : (
                      <p className="text-slate-200 font-medium">{formData.branch}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CGPA Card - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="md:col-span-2"
        >
          <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Cumulative GPA</h3>
                    <p className="text-orange-100 text-sm">Academic Performance</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-5xl font-bold text-white">{formData.cgpa.toFixed(2)}</div>
                  <p className="text-orange-100 text-sm mt-1">out of 4.0</p>
                  <p className="text-xs text-orange-200 mt-1">CGPA is managed by admin</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(formData.cgpa / 4.0) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
