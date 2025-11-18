"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Code, Brain, FileText, MessageSquare, TrendingUp, Trophy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    applications: { total: 25, applied: 15, inProgress: 6, cleared: 2, rejected: 2 },
    coding: { totalProblems: 450, solved: 287, easy: 120, medium: 140, hard: 27 },
    aptitude: { totalTopics: 12, completed: 8, avgScore: 78 },
    interviews: { total: 8, scheduled: 2, completed: 6 },
    streak: 15,
  })

  const applicationStatusData = [
    { name: "Applied", value: stats.applications.applied, color: "#0088FE" },
    { name: "In Progress", value: stats.applications.inProgress, color: "#00C49F" },
    { name: "Cleared", value: stats.applications.cleared, color: "#FFBB28" },
    { name: "Rejected", value: stats.applications.rejected, color: "#FF8042" },
  ]

  const codingProgressData = [
    { name: "Easy", solved: stats.coding.easy, total: 200 },
    { name: "Medium", solved: stats.coding.medium, total: 200 },
    { name: "Hard", solved: stats.coding.hard, total: 50 },
  ]

  const weeklyProgressData = [
    { day: "Mon", problems: 8, aptitude: 2 },
    { day: "Tue", problems: 12, aptitude: 3 },
    { day: "Wed", problems: 6, aptitude: 1 },
    { day: "Thu", problems: 15, aptitude: 4 },
    { day: "Fri", problems: 10, aptitude: 2 },
    { day: "Sat", problems: 18, aptitude: 5 },
    { day: "Sun", problems: 14, aptitude: 3 },
  ]

  const recentActivities = [
    { type: "application", company: "Google", action: "Applied for SDE Role", time: "2 hours ago", status: "applied" },
    {
      type: "coding",
      platform: "LeetCode",
      action: "Solved Binary Tree Inorder Traversal",
      time: "4 hours ago",
      status: "completed",
    },
    {
      type: "interview",
      company: "Microsoft",
      action: "Technical Interview Scheduled",
      time: "1 day ago",
      status: "scheduled",
    },
    {
      type: "aptitude",
      topic: "Logical Reasoning",
      action: "Completed Practice Test",
      time: "2 days ago",
      status: "completed",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500"
      case "inProgress":
        return "bg-yellow-500"
      case "cleared":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "completed":
        return "bg-green-500"
      case "scheduled":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      inProgress: "bg-yellow-100 text-yellow-800",
      cleared: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-600 mt-1">Track your journey to landing your dream job</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.streak} days</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.applications.total}</p>
                </div>
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className={getStatusBadge("cleared")}>{stats.applications.cleared} Cleared</Badge>
                <Badge className={getStatusBadge("inProgress")}>{stats.applications.inProgress} In Progress</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.coding.solved}</p>
                </div>
                <Code className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="mt-4">
                <Progress value={(stats.coding.solved / stats.coding.totalProblems) * 100} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((stats.coding.solved / stats.coding.totalProblems) * 100)}% of target
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aptitude Score</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.aptitude.avgScore}%</p>
                </div>
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress value={stats.aptitude.avgScore} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">
                  {stats.aptitude.completed}/{stats.aptitude.totalTopics} topics completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.interviews.total}</p>
                </div>
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className={getStatusBadge("scheduled")}>{stats.interviews.scheduled} Scheduled</Badge>
                <Badge className={getStatusBadge("completed")}>{stats.interviews.completed} Done</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Coding Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Coding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={codingProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="solved" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="problems" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="aptitude" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/applications">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Company Applications</h3>
                    <p className="text-sm text-gray-600">Track job applications and interviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/coding">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Coding Practice</h3>
                    <p className="text-sm text-gray-600">DSA problems and platform progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/aptitude">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Aptitude Prep</h3>
                    <p className="text-sm text-gray-600">Quant, Logical, Verbal practice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/resume">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Resume Tracker</h3>
                    <p className="text-sm text-gray-600">Versions, feedback, and updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/interviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mock Interviews</h3>
                    <p className="text-sm text-gray-600">Practice sessions and feedback</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rewards">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Rewards & Achievements</h3>
                    <p className="text-sm text-gray-600">Earn points and unlock badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={`${activity.type}-${activity.time}-${index}`} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.company || activity.platform || activity.topic} • {activity.time}
                    </p>
                  </div>
                  <Badge className={getStatusBadge(activity.status)}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
