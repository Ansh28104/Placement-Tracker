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
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Resume {
  id: number
  title: string
  version: string
  type: "master" | "tailored" | "template"
  targetRole: string
  company?: string
  lastModified: string
  status: "active" | "draft" | "archived"
  feedback: string[]
  rating: number
  downloadCount: number
  fileSize: string
  notes: string
}

export default function ResumePage() {
  const { toast } = useToast()
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: 1,
      title: "Software Engineer Resume",
      version: "v3.2",
      type: "master",
      targetRole: "Software Engineer",
      lastModified: "2024-01-15",
      status: "active",
      feedback: ["Strong technical skills section", "Add more quantified achievements", "Good project descriptions"],
      rating: 4,
      downloadCount: 12,
      fileSize: "245 KB",
      notes: "Main resume template with comprehensive experience",
    },
    {
      id: 2,
      title: "Google SDE Application",
      version: "v1.0",
      type: "tailored",
      targetRole: "Software Development Engineer",
      company: "Google",
      lastModified: "2024-01-14",
      status: "active",
      feedback: ["Tailored well for Google's requirements", "Highlight system design experience"],
      rating: 5,
      downloadCount: 3,
      fileSize: "238 KB",
      notes: "Customized for Google application with emphasis on scalability projects",
    },
    {
      id: 3,
      title: "Frontend Developer Resume",
      version: "v2.1",
      type: "tailored",
      targetRole: "Frontend Developer",
      company: "Meta",
      lastModified: "2024-01-12",
      status: "draft",
      feedback: ["Need to add React Native experience", "Good UI/UX project showcase"],
      rating: 3,
      downloadCount: 1,
      fileSize: "251 KB",
      notes: "Focus on frontend technologies and user interface projects",
    },
    {
      id: 4,
      title: "Clean Resume Template",
      version: "v1.0",
      type: "template",
      targetRole: "General",
      lastModified: "2024-01-10",
      status: "archived",
      feedback: ["Clean design", "Easy to customize"],
      rating: 4,
      downloadCount: 8,
      fileSize: "189 KB",
      notes: "Minimalist template for quick customization",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newResume, setNewResume] = useState({
    title: "",
    type: "tailored",
    targetRole: "",
    company: "",
    notes: "",
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "master":
        return "bg-blue-100 text-blue-800"
      case "tailored":
        return "bg-green-100 text-green-800"
      case "template":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "draft":
        return <Clock className="w-4 h-4" />
      case "archived":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resume.company && resume.company.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || resume.type === typeFilter
    const matchesStatus = statusFilter === "all" || resume.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddResume = () => {
    const resume: Resume = {
      ...newResume,
      id: resumes.length + 1,
      type: newResume.type as "master" | "tailored" | "template",
      version: "v1.0",
      lastModified: new Date().toISOString().split("T")[0],
      status: "draft",
      feedback: [],
      rating: 0,
      downloadCount: 0,
      fileSize: "0 KB",
    }

    setResumes([...resumes, resume])
    setNewResume({
      title: "",
      type: "tailored",
      targetRole: "",
      company: "",
      notes: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Resume added!",
      description: "New resume has been added to your collection.",
    })
  }

  const updateResumeStatus = (resumeId: number, newStatus: "active" | "draft" | "archived") => {
    setResumes(
      resumes.map((resume) =>
        resume.id === resumeId
          ? {
              ...resume,
              status: newStatus,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : resume,
      ),
    )
    toast({
      title: "Status updated!",
      description: `Resume marked as ${newStatus}.`,
    })
  }

  const handleDownload = (resumeId: number) => {
    setResumes(
      resumes.map((resume) =>
        resume.id === resumeId ? { ...resume, downloadCount: resume.downloadCount + 1 } : resume,
      ),
    )
    toast({
      title: "Resume downloaded!",
      description: "Resume has been downloaded successfully.",
    })
  }

  const stats = {
    total: resumes.length,
    active: resumes.filter((r) => r.status === "active").length,
    draft: resumes.filter((r) => r.status === "draft").length,
    archived: resumes.filter((r) => r.status === "archived").length,
    master: resumes.filter((r) => r.type === "master").length,
    tailored: resumes.filter((r) => r.type === "tailored").length,
    template: resumes.filter((r) => r.type === "template").length,
    avgRating:
      resumes.length > 0 ? Math.round((resumes.reduce((acc, r) => acc + r.rating, 0) / resumes.length) * 10) / 10 : 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Manager</h1>
              <p className="text-gray-600 mt-1">Manage and track your resume versions and applications</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resume
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Resume</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="title">Resume Title</Label>
                    <Input
                      id="title"
                      value={newResume.title}
                      onChange={(e) => setNewResume({ ...newResume, title: e.target.value })}
                      placeholder="e.g., Software Engineer Resume"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newResume.type}
                      onValueChange={(value) => setNewResume({ ...newResume, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">Master Resume</SelectItem>
                        <SelectItem value="tailored">Tailored Resume</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetRole">Target Role</Label>
                    <Input
                      id="targetRole"
                      value={newResume.targetRole}
                      onChange={(e) => setNewResume({ ...newResume, targetRole: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={newResume.company}
                      onChange={(e) => setNewResume({ ...newResume, company: e.target.value })}
                      placeholder="e.g., Google"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newResume.notes}
                      onChange={(e) => setNewResume({ ...newResume, notes: e.target.value })}
                      placeholder="Any notes about this resume..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddResume}>Add Resume</Button>
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
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                <p className="text-sm text-gray-600">Draft</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                <p className="text-sm text-gray-600">Archived</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-blue-600">{stats.master}</p>
                <p className="text-sm text-gray-600">Master</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-green-600">{stats.tailored}</p>
                <p className="text-sm text-gray-600">Tailored</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-purple-600">{stats.template}</p>
                <p className="text-sm text-gray-600">Templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-orange-600">{stats.avgRating}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
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
                      placeholder="Search resumes..."
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
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="tailored">Tailored</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resumes List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {resume.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">
                        {resume.targetRole} {resume.company && `• ${resume.company}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(resume.status)}>
                        {getStatusIcon(resume.status)}
                        <span className="ml-1 capitalize">{resume.status}</span>
                      </Badge>
                      <Badge className={getTypeColor(resume.type)}>{resume.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Version: {resume.version}</span>
                        <span className="text-gray-600">Size: {resume.fileSize}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < resume.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({resume.rating})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Modified: {new Date(resume.lastModified).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {resume.downloadCount} downloads
                      </div>
                    </div>

                    {resume.feedback.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 mb-2">Recent Feedback:</p>
                        <ul className="text-sm text-blue-600 space-y-1">
                          {resume.feedback.slice(0, 2).map((feedback, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              {feedback}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resume.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{resume.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(resume.id)}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        {resume.status !== "active" && (
                          <Button size="sm" onClick={() => updateResumeStatus(resume.id, "active")}>
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResumes.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first resume."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
