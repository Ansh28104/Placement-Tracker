"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Mail, Calendar, Award, Flame, Trophy, Code, Target, BookOpen, MessageSquare } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  bio?: string
  phone?: string
  university?: string
  branch?: string
  graduationYear?: number
  joinDate: string
  points: number
  level: number
  streak: number
}

interface Stat {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        bio: user.bio || "Passionate about placement preparation",
        phone: user.phone || "+91 (555) 123-4567",
        university: user.university || "IIT Delhi",
        branch: user.branch || "Computer Science & Engineering",
        graduationYear: user.graduationYear || 2024,
        joinDate: user.joinDate || new Date().toISOString(),
        points: user.points,
        level: user.level,
        streak: user.streak,
      })
    }
  }, [user])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: name === "graduationYear" ? parseInt(value) : value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (profile) {
        setProfile(prev => prev ? { ...prev, ...editForm } : null)
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditOpen = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        phone: profile.phone,
        university: profile.university,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
      })
    }
    setIsEditing(true)
  }

  if (!profile) return null

  const stats: Stat[] = [
    { label: "Level", value: profile.level, icon: <Award className="w-5 h-5" />, color: "text-blue-600" },
    { label: "Points", value: profile.points, icon: <Trophy className="w-5 h-5" />, color: "text-yellow-600" },
    { label: "Streak", value: profile.streak, icon: <Flame className="w-5 h-5" />, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full">
        {/* Header with Avatar and Basic Info */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-blue-500">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profile.name} />
                <AvatarFallback className="text-2xl">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600 mt-1">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Level {profile.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {profile.branch}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Class of {profile.graduationYear}
                  </Badge>
                </div>
              </div>

              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button onClick={handleEditOpen} className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your profile information</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleEditChange}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editForm.email || ""}
                        onChange={handleEditChange}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={editForm.phone || ""}
                        onChange={handleEditChange}
                        placeholder="+91 (555) 123-4567"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editForm.bio || ""}
                        onChange={handleEditChange}
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          name="university"
                          value={editForm.university || ""}
                          onChange={handleEditChange}
                          placeholder="IIT Delhi"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input
                          id="branch"
                          name="branch"
                          value={editForm.branch || ""}
                          onChange={handleEditChange}
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        type="number"
                        value={editForm.graduationYear || ""}
                        onChange={handleEditChange}
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} opacity-20 bg-current p-4 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="border-t pt-4 flex items-start gap-3">
                <Trophy className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{profile.phone}</p>
                </div>
              </div>
              <div className="border-t pt-4 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">{new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your educational background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">University</p>
                  <p className="font-medium text-gray-900">{profile.university}</p>
                </div>
              </div>
              <div className="border-t pt-4 flex items-start gap-3">
                <Code className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium text-gray-900">{profile.branch}</p>
                </div>
              </div>
              <div className="border-t pt-4 flex items-start gap-3">
                <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Graduation Year</p>
                  <p className="font-medium text-gray-900">{profile.graduationYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary */}
        <Card className="mt-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your placement journey progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Code className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Coding Problems</p>
                <p className="text-2xl font-bold text-blue-600">42</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Target className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-green-600">28</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <BookOpen className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Resources</p>
                <p className="text-2xl font-bold text-orange-600">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
