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
  Zap,
  TrendingUp,
  Check,
  X,
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
  fileName?: string
  fileData?: string
  atsScore?: number
  atsAnalysis?: ATSAnalysis
}

interface ATSAnalysis {
  score: number
  issues: ATSIssue[]
  suggestions: string[]
  keywords: string[]
  formatting: {
    hasSimpleFormatting: boolean
    hasStandardSections: boolean
    hasContactInfo: boolean
    hasMetrics: boolean
  }
}

interface ATSIssue {
  type: "error" | "warning" | "info"
  message: string
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
      atsScore: 85,
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
      atsScore: 92,
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
      atsScore: 78,
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
      atsScore: 88,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedAtsResume, setSelectedAtsResume] = useState<number | null>(null)
  const [newResume, setNewResume] = useState({
    title: "",
    type: "tailored",
    targetRole: "",
    company: "",
    notes: "",
  })

  // ATS Analysis function
  const analyzeResumeForATS = (resume: Resume): ATSAnalysis => {
    const issues: ATSIssue[] = []
    const suggestions: string[] = []
    const keywords: string[] = []
    let score = 100

    // Check for contact information
    if (!resume.fileName && !resume.notes) {
      issues.push({ type: "error", message: "Missing contact information section" })
      score -= 15
    } else {
      keywords.push("contact_info")
    }

    // Check for metrics and quantifiable achievements
    const notes = resume.notes.toLowerCase()
    const hasMetrics = /\b\d+%|\$\d+|\d+x|improved|increased|decreased|reduced/i.test(notes)
    if (!hasMetrics) {
      suggestions.push("Add quantifiable metrics and achievements (e.g., 'Improved performance by 40%')")
      score -= 10
    } else {
      keywords.push("metrics")
    }

    // Check for standard sections
    const standardSections = ["experience", "education", "skills", "projects"]
    const hasSections = standardSections.some((section) => notes.includes(section.toLowerCase()))
    if (!hasSections) {
      suggestions.push("Ensure resume includes standard sections: Experience, Education, Skills, Projects")
      score -= 10
    } else {
      keywords.push("standard_sections")
    }

    // Check for technical keywords
    const techKeywords = [
      "python",
      "java",
      "javascript",
      "typescript",
      "react",
      "nodejs",
      "sql",
      "api",
      "aws",
      "git",
      "agile",
    ]
    const foundTechKeywords = techKeywords.filter((keyword) => notes.includes(keyword.toLowerCase()))
    if (foundTechKeywords.length === 0) {
      suggestions.push("Add relevant technical keywords based on job description (Python, Java, React, AWS, etc.)")
      score -= 5
    }
    keywords.push(...foundTechKeywords)

    // Check for action verbs
    const actionVerbs = [
      "developed",
      "implemented",
      "designed",
      "led",
      "managed",
      "optimized",
      "engineered",
      "created",
      "built",
    ]
    const hasActionVerbs = actionVerbs.some((verb) => notes.includes(verb.toLowerCase()))
    if (!hasActionVerbs) {
      suggestions.push("Use strong action verbs at the beginning of bullet points (Developed, Implemented, Designed, etc.)")
      score -= 5
    }

    // Check file size and formatting
    if (resume.fileSize.includes("MB") || parseInt(resume.fileSize) > 1000) {
      issues.push({ type: "warning", message: "File size is large - keep resume under 1 MB for better ATS parsing" })
      score -= 5
    }

    // Formatting checks
    const formatting = {
      hasSimpleFormatting: true,
      hasStandardSections: hasSections,
      hasContactInfo: !!(resume.fileName || resume.notes),
      hasMetrics: hasMetrics,
    }

    // ATS-friendly format tips
    if (!notes.includes("objective") && !notes.includes("summary")) {
      suggestions.push("Consider adding a Professional Summary or Objective section")
      score -= 3
    }

    score = Math.max(0, Math.min(100, score))

    return {
      score,
      issues,
      suggestions,
      keywords: [...new Set(keywords)],
      formatting,
    }
  }

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
    if (!newResume.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a resume title.",
        variant: "destructive",
      })
      return
    }

    if (!newResume.targetRole.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target role.",
        variant: "destructive",
      })
      return
    }

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please upload a resume file.",
        variant: "destructive",
      })
      return
    }

    // Calculate file size in KB
    const fileSizeKB = Math.round(selectedFile.size / 1024)
    const fileSize = fileSizeKB > 1024 ? `${(fileSizeKB / 1024).toFixed(1)} MB` : `${fileSizeKB} KB`

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
      fileSize,
      fileName: selectedFile.name,
    }

    // Perform ATS analysis
    const atsAnalysis = analyzeResumeForATS(resume)
    resume.atsScore = atsAnalysis.score
    resume.atsAnalysis = atsAnalysis

    setResumes([...resumes, resume])
    setNewResume({
      title: "",
      type: "tailored",
      targetRole: "",
      company: "",
      notes: "",
    })
    setSelectedFile(null)
    setIsAddDialogOpen(false)
    toast({
      title: "Resume added!",
      description: `${selectedFile.name} uploaded. ATS Score: ${atsAnalysis.score}/100`,
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      validateAndSetFile(files[0])
    }
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
    const resume = resumes.find((r) => r.id === resumeId)
    if (resume) {
      // Create a simple text file for download (in production, this would be the actual file)
      const element = document.createElement("a")
      const file = new Blob(
        [
          `Resume: ${resume.title}\n` +
          `Target Role: ${resume.targetRole}\n` +
          `${resume.company ? `Company: ${resume.company}\n` : ""}` +
          `Type: ${resume.type}\n` +
          `Version: ${resume.version}\n` +
          `Status: ${resume.status}\n` +
          `Modified: ${resume.lastModified}\n\n` +
          `Notes:\n${resume.notes || "No notes"}\n\n` +
          `Feedback:\n${resume.feedback.join("\n") || "No feedback yet"}`
        ],
        { type: "text/plain" }
      )
      element.href = URL.createObjectURL(file)
      element.download = resume.fileName || `${resume.title.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      setResumes(
        resumes.map((r) =>
          r.id === resumeId ? { ...r, downloadCount: r.downloadCount + 1 } : r,
        ),
      )
      toast({
        title: "Resume downloaded!",
        description: `${resume.fileName || resume.title} has been downloaded successfully.`,
      })
    }
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
    avgAtsScore:
      resumes.length > 0
        ? Math.round((resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length) * 10) / 10
        : 0,
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

                  {/* File Upload Section */}
                  <div className="sm:col-span-2">
                    <Label>Resume File (PDF or Word)</Label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400 bg-gray-50"
                      }`}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <FileText className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile ? selectedFile.name : "Drag and drop your resume here"}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">or click to select a file</p>
                          <p className="text-xs text-gray-500 mt-2">PDF or Word documents (max 5MB)</p>
                        </div>
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-sm text-green-700">
                          ✓ File selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          className="text-red-600 mt-1"
                        >
                          Remove file
                        </Button>
                      </div>
                    )}
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      setSelectedFile(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddResume}>Add Resume</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-4">
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
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-purple-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-1" />
                  {stats.avgAtsScore}
                </p>
                <p className="text-sm text-gray-600">Avg ATS</p>
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

                    {/* ATS Score Display */}
                    {resume.atsScore && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-semibold text-purple-900">ATS Score</p>
                            <p className="text-xs text-purple-700">Applicant Tracking System compatibility</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{resume.atsScore}</p>
                          <p className="text-xs text-purple-600">/100</p>
                        </div>
                      </div>
                    )}

                    {resume.fileName && (
                      <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-2 rounded">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-blue-700 font-medium truncate">{resume.fileName}</span>
                      </div>
                    )}

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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAtsResume(resume.id)}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          ATS Check
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

          {/* ATS Analysis Dialog */}
          {selectedAtsResume && (
            <Dialog open={!!selectedAtsResume} onOpenChange={(open) => !open && setSelectedAtsResume(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    ATS Analysis Report
                  </DialogTitle>
                </DialogHeader>
                {(() => {
                  const selectedResume = resumes.find((r) => r.id === selectedAtsResume)
                  if (!selectedResume) return null

                  const analysis = selectedResume.atsAnalysis || analyzeResumeForATS(selectedResume)

                  const getScoreColor = (score: number) => {
                    if (score >= 80) return "text-green-600"
                    if (score >= 60) return "text-yellow-600"
                    return "text-red-600"
                  }

                  return (
                    <div className="space-y-6">
                      {/* Score Card */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Overall ATS Compatibility Score</p>
                            <p className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}/100</p>
                          </div>
                          <div className="w-24 h-24 rounded-full bg-white border-4 border-purple-300 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-600">{analysis.score}%</p>
                              <p className="text-xs text-gray-600">Compatible</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Formatting Checks */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Formatting Checks
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            {
                              label: "Standard Sections",
                              value: analysis.formatting.hasStandardSections,
                            },
                            { label: "Contact Info", value: analysis.formatting.hasContactInfo },
                            {
                              label: "Quantified Metrics",
                              value: analysis.formatting.hasMetrics,
                            },
                            {
                              label: "Simple Formatting",
                              value: analysis.formatting.hasSimpleFormatting,
                            },
                          ].map((check, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                                check.value
                                  ? "bg-green-50 border-green-200"
                                  : "bg-red-50 border-red-200"
                              }`}
                            >
                              {check.value ? (
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                              )}
                              <span className={check.value ? "text-green-700" : "text-red-700"}>
                                {check.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Issues */}
                      {analysis.issues.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            Issues Found
                          </h3>
                          <div className="space-y-2">
                            {analysis.issues.map((issue, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border-l-4 ${
                                  issue.type === "error"
                                    ? "bg-red-50 border-red-400 text-red-700"
                                    : issue.type === "warning"
                                      ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                                      : "bg-blue-50 border-blue-400 text-blue-700"
                                }`}
                              >
                                {issue.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {analysis.suggestions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Improvement Suggestions
                          </h3>
                          <ul className="space-y-2">
                            {analysis.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-yellow-600 font-bold mt-1">•</span>
                                <span className="text-gray-700">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Keywords */}
                      {analysis.keywords.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Detected Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                className="bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Info Box */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                          <strong>💡 Tip:</strong> ATS systems parse resumes to extract relevant information. A higher score
                          indicates better compatibility with automated systems. Aim for scores above 75 for optimal
                          results.
                        </p>
                      </div>

                      <Button onClick={() => setSelectedAtsResume(null)} className="w-full">
                        Close
                      </Button>
                    </div>
                  )
                })()}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
