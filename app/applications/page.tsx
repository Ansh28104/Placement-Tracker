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
  Building2,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Application {
  id: number
  company: string
  position: string
  location: string
  salary: string
  appliedDate: string
  status: "applied" | "screening" | "interview" | "offer" | "rejected"
  notes: string
  nextStep: string
  deadline: string
}

export default function ApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      company: "Google",
      position: "Software Engineer",
      location: "Mountain View, CA",
      salary: "$120,000 - $180,000",
      appliedDate: "2024-01-15",
      status: "interview",
      notes: "Applied through referral. Technical interview scheduled for next week.",
      nextStep: "Technical Interview",
      deadline: "2024-02-01",
    },
    {
      id: 2,
      company: "Microsoft",
      position: "SDE II",
      location: "Seattle, WA",
      salary: "$130,000 - $190,000",
      appliedDate: "2024-01-12",
      status: "screening",
      notes: "HR screening completed. Waiting for technical round.",
      nextStep: "Technical Round",
      deadline: "2024-01-30",
    },
    {
      id: 3,
      company: "Amazon",
      position: "Software Development Engineer",
      location: "Austin, TX",
      salary: "$115,000 - $170,000",
      appliedDate: "2024-01-10",
      status: "applied",
      notes: "Application submitted through company website.",
      nextStep: "Wait for response",
      deadline: "2024-01-25",
    },
    {
      id: 4,
      company: "Meta",
      position: "Frontend Engineer",
      location: "Menlo Park, CA",
      salary: "$125,000 - $185,000",
      appliedDate: "2024-01-08",
      status: "offer",
      notes: "Received offer! Need to respond by end of week.",
      nextStep: "Accept/Decline Offer",
      deadline: "2024-01-20",
    },
    {
      id: 5,
      company: "Netflix",
      position: "Senior Software Engineer",
      location: "Los Gatos, CA",
      salary: "$140,000 - $200,000",
      appliedDate: "2024-01-05",
      status: "rejected",
      notes: "Rejected after technical interview. Good learning experience.",
      nextStep: "Apply to similar roles",
      deadline: "",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newApplication, setNewApplication] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    notes: "",
    nextStep: "",
    deadline: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "screening":
        return "bg-yellow-100 text-yellow-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "offer":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="w-4 h-4" />
      case "screening":
        return <AlertCircle className="w-4 h-4" />
      case "interview":
        return <Calendar className="w-4 h-4" />
      case "offer":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddApplication = () => {
    const application: Application = {
      ...newApplication,
      id: applications.length + 1,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "applied",
    }

    setApplications([...applications, application])
    setNewApplication({
      company: "",
      position: "",
      location: "",
      salary: "",
      notes: "",
      nextStep: "",
      deadline: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Application added!",
      description: "Your job application has been tracked successfully.",
    })
  }

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    screening: applications.filter((a) => a.status === "screening").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
              <p className="text-gray-600 mt-1">Track and manage your job applications</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newApplication.company}
                      onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
                      placeholder="e.g., Google"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newApplication.position}
                      onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newApplication.location}
                      onChange={(e) => setNewApplication({ ...newApplication, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      value={newApplication.salary}
                      onChange={(e) => setNewApplication({ ...newApplication, salary: e.target.value })}
                      placeholder="e.g., $120,000 - $180,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextStep">Next Step</Label>
                    <Input
                      id="nextStep"
                      value={newApplication.nextStep}
                      onChange={(e) => setNewApplication({ ...newApplication, nextStep: e.target.value })}
                      placeholder="e.g., Wait for response"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newApplication.deadline}
                      onChange={(e) => setNewApplication({ ...newApplication, deadline: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newApplication.notes}
                      onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                      placeholder="Any additional notes..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddApplication}>Add Application</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
                <p className="text-sm text-gray-600">Applied</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.screening}</p>
                <p className="text-sm text-gray-600">Screening</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
                <p className="text-sm text-gray-600">Interview</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
                <p className="text-sm text-gray-600">Offers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
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
                      placeholder="Search companies or positions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {application.company}
                      </CardTitle>
                      <p className="text-gray-600 font-medium">{application.position}</p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {application.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {application.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Applied: {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                    {application.deadline && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Deadline: {new Date(application.deadline).toLocaleDateString()}
                      </div>
                    )}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Next Step:</p>
                      <p className="text-sm text-gray-600">{application.nextStep}</p>
                    </div>
                    {application.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 mb-1">Notes:</p>
                        <p className="text-sm text-blue-600">{application.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first job application."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
