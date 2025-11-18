"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  Phone,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Interview {
  id: number
  company: string
  position: string
  type: "technical" | "behavioral" | "system-design" | "hr" | "final"
  mode: "in-person" | "video" | "phone"
  interviewer: string
  scheduledDate: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  result?: "passed" | "failed" | "pending"
  feedback: string
  notes: string
  preparationTime: number
  difficulty: "easy" | "medium" | "hard"
}

export default function InterviewsPage() {
  const { toast } = useToast()
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 1,
      company: "Google",
      position: "Software Engineer",
      type: "technical",
      mode: "video",
      interviewer: "John Smith",
      scheduledDate: "2024-01-20T10:00",
      duration: 60,
      status: "scheduled",
      feedback: "",
      notes: "Focus on algorithms and data structures. Review binary trees and dynamic programming.",
      preparationTime: 120,
      difficulty: "hard",
    },
    {
      id: 2,
      company: "Microsoft",
      position: "SDE II",
      type: "behavioral",
      mode: "video",
      interviewer: "Sarah Johnson",
      scheduledDate: "2024-01-18T14:00",
      duration: 45,
      status: "completed",
      result: "passed",
      feedback: "Great communication skills and leadership examples. Well-prepared STAR responses.",
      notes: "Prepared leadership and teamwork examples. Discussed conflict resolution scenarios.",
      preparationTime: 90,
      difficulty: "medium",
    },
    {
      id: 3,
      company: "Amazon",
      position: "Software Development Engineer",
      type: "system-design",
      mode: "video",
      interviewer: "Mike Chen",
      scheduledDate: "2024-01-16T11:00",
      duration: 75,
      status: "completed",
      result: "passed",
      feedback: "Solid system design approach. Good understanding of scalability and trade-offs.",
      notes: "Designed a URL shortener service. Covered load balancing, caching, and database sharding.",
      preparationTime: 180,
      difficulty: "hard",
    },
    {
      id: 4,
      company: "Meta",
      position: "Frontend Engineer",
      type: "technical",
      mode: "in-person",
      interviewer: "Lisa Wang",
      scheduledDate: "2024-01-14T15:30",
      duration: 60,
      status: "completed",
      result: "failed",
      feedback: "Good React knowledge but struggled with optimization questions. Need more practice with performance.",
      notes: "Focused on React, JavaScript, and CSS. Asked about virtual DOM and component lifecycle.",
      preparationTime: 150,
      difficulty: "medium",
    },
    {
      id: 5,
      company: "Apple",
      position: "iOS Developer",
      type: "hr",
      mode: "phone",
      interviewer: "David Brown",
      scheduledDate: "2024-01-12T09:00",
      duration: 30,
      status: "completed",
      result: "passed",
      feedback: "Good cultural fit. Enthusiastic about Apple's mission and products.",
      notes: "Discussed background, motivation, and interest in iOS development.",
      preparationTime: 60,
      difficulty: "easy",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newInterview, setNewInterview] = useState({
    company: "",
    position: "",
    type: "technical",
    mode: "video",
    interviewer: "",
    scheduledDate: "",
    duration: "60",
    notes: "",
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technical":
        return "bg-blue-100 text-blue-800"
      case "behavioral":
        return "bg-green-100 text-green-800"
      case "system-design":
        return "bg-purple-100 text-purple-800"
      case "hr":
        return "bg-orange-100 text-orange-800"
      case "final":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "passed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      case "rescheduled":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "video":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      case "in-person":
        return <Users className="w-4 h-4" />
      default:
        return <Video className="w-4 h-4" />
    }
  }

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || interview.type === typeFilter
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter
    const matchesMode = modeFilter === "all" || interview.mode === modeFilter
    return matchesSearch && matchesType && matchesStatus && matchesMode
  })

  const handleAddInterview = () => {
    const interview: Interview = {
      ...newInterview,
      id: interviews.length + 1,
      type: newInterview.type as "technical" | "behavioral" | "system-design" | "hr" | "final",
      mode: newInterview.mode as "in-person" | "video" | "phone",
      duration: Number.parseInt(newInterview.duration),
      status: "scheduled",
      feedback: "",
      preparationTime: 0,
      difficulty: "medium",
    }

    setInterviews([...interviews, interview])
    setNewInterview({
      company: "",
      position: "",
      type: "technical",
      mode: "video",
      interviewer: "",
      scheduledDate: "",
      duration: "60",
      notes: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Interview scheduled!",
      description: "New interview has been added to your calendar.",
    })
  }

  const updateInterviewStatus = (
    interviewId: number,
    newStatus: "scheduled" | "completed" | "cancelled" | "rescheduled",
  ) => {
    setInterviews(
      interviews.map((interview) => (interview.id === interviewId ? { ...interview, status: newStatus } : interview)),
    )
    toast({
      title: "Status updated!",
      description: `Interview marked as ${newStatus}.`,
    })
  }

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i) => i.status === "scheduled").length,
    completed: interviews.filter((i) => i.status === "completed").length,
    cancelled: interviews.filter((i) => i.status === "cancelled").length,
    passed: interviews.filter((i) => i.result === "passed").length,
    failed: interviews.filter((i) => i.result === "failed").length,
    pending: interviews.filter((i) => i.result === "pending").length,
    totalPrepTime: interviews.reduce((acc, i) => acc + i.preparationTime, 0),
    avgPrepTime:
      interviews.length > 0
        ? Math.round(interviews.reduce((acc, i) => acc + i.preparationTime, 0) / interviews.length)
        : 0,
  }

  const successRate = stats.completed > 0 ? Math.round((stats.passed / stats.completed) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Tracker</h1>
              <p className="text-gray-600 mt-1">Manage and track your interview schedule and performance</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Interview</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newInterview.company}
                      onChange={(e) => setNewInterview({ ...newInterview, company: e.target.value })}
                      placeholder="e.g., Google"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newInterview.position}
                      onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Interview Type</Label>
                    <Select
                      value={newInterview.type}
                      onValueChange={(value) => setNewInterview({ ...newInterview, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="system-design">System Design</SelectItem>
                        <SelectItem value="hr">HR/Screening</SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mode">Interview Mode</Label>
                    <Select
                      value={newInterview.mode}
                      onValueChange={(value) => setNewInterview({ ...newInterview, mode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="interviewer">Interviewer</Label>
                    <Input
                      id="interviewer"
                      value={newInterview.interviewer}
                      onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newInterview.duration}
                      onChange={(e) => setNewInterview({ ...newInterview, duration: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={newInterview.scheduledDate}
                      onChange={(e) => setNewInterview({ ...newInterview, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Preparation Notes</Label>
                    <Textarea
                      id="notes"
                      value={newInterview.notes}
                      onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                      placeholder="Topics to review, questions to prepare..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddInterview}>Schedule Interview</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
                <p className="text-sm text-gray-600">Passed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.totalPrepTime}</p>
                <p className="text-sm text-gray-600">Prep Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.avgPrepTime}</p>
                <p className="text-sm text-gray-600">Avg Prep</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search interviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                    <SelectItem value="hr">HR/Screening</SelectItem>
                    <SelectItem value="final">Final Round</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Interviews List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {interview.company}
                      </CardTitle>
                      <p className="text-gray-600 font-medium">{interview.position}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(interview.status)}>
                        {getStatusIcon(interview.status)}
                        <span className="ml-1 capitalize">{interview.status}</span>
                      </Badge>
                      {interview.result && (
                        <Badge className={getResultColor(interview.result)}>{interview.result}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(interview.type)} variant="outline">
                        {interview.type.replace("-", " ")}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getModeIcon(interview.mode)}
                          {interview.mode.replace("-", " ")}
                        </Badge>
                        <Badge className={getDifficultyColor(interview.difficulty)}>{interview.difficulty}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{interview.interviewer}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{interview.duration} minutes</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(interview.scheduledDate).toLocaleString()}
                    </div>

                    {interview.preparationTime > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Prep time: {interview.preparationTime} minutes
                      </div>
                    )}

                    {interview.feedback && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 mb-1">Feedback:</p>
                        <p className="text-sm text-blue-600">{interview.feedback}</p>
                      </div>
                    )}

                    {interview.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{interview.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        {interview.status === "scheduled" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateInterviewStatus(interview.id, "completed")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateInterviewStatus(interview.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Add Feedback
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInterviews.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" || modeFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by scheduling your first interview."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Your First Interview
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
