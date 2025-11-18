"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { 
  Bell, Lock, Eye, Mail, Shield, Download, Trash2, LogOut, Moon, Palette,
  Volume2, Clock, ToggleLeft
} from "lucide-react"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  goalReminders: boolean
  interviewReminders: boolean
  achievementNotifications: boolean
  weeklyDigest: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  showActivity: boolean
  allowMessages: boolean
  allowFriendRequests: boolean
}

interface AppearanceSettings {
  theme: "light" | "dark" | "auto"
  fontSize: "small" | "medium" | "large"
  compactMode: boolean
}

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    goalReminders: true,
    interviewReminders: true,
    achievementNotifications: true,
    weeklyDigest: false,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "public",
    showActivity: true,
    allowMessages: true,
    allowFriendRequests: true,
  })

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "auto",
    fontSize: "medium",
    compactMode: false,
  })

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
    toast({
      title: "Updated",
      description: "Notification preferences updated",
    })
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value?: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }))
    toast({
      title: "Updated",
      description: "Privacy settings updated",
    })
  }

  const handleAppearanceChange = (key: keyof AppearanceSettings, value?: any) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }))
    toast({
      title: "Updated",
      description: "Appearance settings updated",
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSavePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Password changed successfully",
    })
    setIsChangingPassword(false)
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Warning",
      description: "Account deletion initiated. This action cannot be undone.",
      variant: "destructive",
    })
  }

  const handleDownloadData = () => {
    toast({
      title: "Processing",
      description: "Your data export is being prepared. You'll receive it via email.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and preferences</p>
        </div>

        {/* Notification Settings */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive updates and reminders</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <Label className="text-base font-medium cursor-pointer">Email Notifications</Label>
                    <p className="text-sm text-gray-500 mt-0.5">Receive important updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationChange("emailNotifications")}
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <Label className="text-base font-medium cursor-pointer">Push Notifications</Label>
                    <p className="text-sm text-gray-500 mt-0.5">Receive push notifications on your device</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={() => handleNotificationChange("pushNotifications")}
                />
              </div>

              {/* Goal Reminders */}
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <Label className="text-base font-medium cursor-pointer">Goal Reminders</Label>
                    <p className="text-sm text-gray-500 mt-0.5">Get reminders for your daily goals</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.goalReminders}
                  onCheckedChange={() => handleNotificationChange("goalReminders")}
                />
              </div>

              {/* Interview Reminders */}
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <Label className="text-base font-medium cursor-pointer">Interview Reminders</Label>
                    <p className="text-sm text-gray-500 mt-0.5">Get reminded about upcoming interviews</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.interviewReminders}
                  onCheckedChange={() => handleNotificationChange("interviewReminders")}
                />
              </div>

              {/* Achievement Notifications */}
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                  <div>
                    <Label className="text-base font-medium cursor-pointer">Achievement Notifications</Label>
                    <p className="text-sm text-gray-500 mt-0.5">Get notified when you earn achievements</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.achievementNotifications}
                  onCheckedChange={() => handleNotificationChange("achievementNotifications")}
                />
              </div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <Label className="text-base font-medium cursor-pointer">Weekly Digest</Label>
                    <p className="text-sm text-gray-500 mt-0.5">Receive a weekly summary of your progress</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={() => handleNotificationChange("weeklyDigest")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Visibility */}
            <div className="p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-gray-400" />
                <Label htmlFor="profileVisibility" className="text-base font-medium cursor-pointer">Profile Visibility</Label>
              </div>
              <select
                id="profileVisibility"
                aria-label="Profile Visibility"
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>

            {/* Show Activity */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div>
                <Label className="text-base font-medium cursor-pointer">Show Activity</Label>
                <p className="text-sm text-gray-500 mt-0.5">Show your progress to other users</p>
              </div>
              <Switch
                checked={privacy.showActivity}
                onCheckedChange={() => handlePrivacyChange("showActivity")}
              />
            </div>

            {/* Allow Messages */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div>
                <Label className="text-base font-medium cursor-pointer">Allow Messages</Label>
                <p className="text-sm text-gray-500 mt-0.5">Allow other users to message you</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={() => handlePrivacyChange("allowMessages")}
              />
            </div>

            {/* Allow Friend Requests */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div>
                <Label className="text-base font-medium cursor-pointer">Allow Friend Requests</Label>
                <p className="text-sm text-gray-500 mt-0.5">Allow other users to send you friend requests</p>
              </div>
              <Switch
                checked={privacy.allowFriendRequests}
                onCheckedChange={() => handlePrivacyChange("allowFriendRequests")}
              />
            </div>

            {/* Change Password */}
            <div className="border-t pt-4">
              <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 w-full">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Enter your current and new password</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePassword}>Save Password</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme */}
            <div className="p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <Moon className="w-5 h-5 text-gray-400" />
                <Label htmlFor="theme" className="text-base font-medium cursor-pointer">Theme</Label>
              </div>
              <select
                id="theme"
                aria-label="Theme Selection"
                value={appearance.theme}
                onChange={(e) => handleAppearanceChange("theme", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (based on system)</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <ToggleLeft className="w-5 h-5 text-gray-400" />
                <Label htmlFor="fontSize" className="text-base font-medium cursor-pointer">Font Size</Label>
              </div>
              <select
                id="fontSize"
                aria-label="Font Size Selection"
                value={appearance.fontSize}
                onChange={(e) => handleAppearanceChange("fontSize", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div>
                <Label className="text-base font-medium cursor-pointer">Compact Mode</Label>
                <p className="text-sm text-gray-500 mt-0.5">Use a more compact layout</p>
              </div>
              <Switch
                checked={appearance.compactMode}
                onCheckedChange={() => handleAppearanceChange("compactMode")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Account */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              <div>
                <CardTitle>Data & Account</CardTitle>
                <CardDescription>Manage your data and account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleDownloadData}>
              <Download className="w-4 h-4" />
              Download My Data
            </Button>

            <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p><strong>App Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Your Account:</strong> {user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
