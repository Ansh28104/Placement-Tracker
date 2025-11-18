"use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Code, Plus, Search, Calendar, Clock, CheckCircle, Target, TrendingUp } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useApi, apiCall } from "@/hooks/use-api"

interface CodingProblem {
  _id?: string
  title: string
  platform: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  status: "todo" | "in-progress" | "completed"
  solvedDate?: string
  timeSpent?: number
  notes: string
  link?: string
}

export default function CodingPage() {
  const { toast } = useToast()
  const { data: rawProblems, loading } = useApi<CodingProblem[]>("/api/coding")
  const [problems, setProblems] = useState<CodingProblem[]>([
    {
      _id: "1",
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "easy",
      category: "Array",
      status: "completed",
      solvedDate: "2024-01-10",
      timeSpent: 30,
      notes: "Used hash map approach. Time: O(n), Space: O(n)",
      link: "https://leetcode.com/problems/two-sum/",
    },
    {
      _id: "2",
      title: "Add Two Numbers",
      platform: "LeetCode",
      difficulty: "medium",
      category: "LinkedList",
      status: "completed",
      solvedDate: "2024-01-12",
      timeSpent: 45,
      notes: "Handle carry correctly. Linked list traversal.",
      link: "https://leetcode.com/problems/add-two-numbers/",
    },
    {
      _id: "3",
      title: "Longest Substring Without Repeating Characters",
      platform: "LeetCode",
      difficulty: "medium",
      category: "String",
      status: "in-progress",
      timeSpent: 20,
      notes: "Sliding window approach. Using character set.",
      link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    },
    {
      _id: "4",
      title: "Median of Two Sorted Arrays",
      platform: "LeetCode",
      difficulty: "hard",
      category: "Array",
      status: "todo",
      notes: "Binary search approach. Challenging edge cases.",
      link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    },
    {
      _id: "5",
      title: "Binary Tree Level Order Traversal",
      platform: "LeetCode",
      difficulty: "medium",
      category: "Tree",
      status: "todo",
      notes: "BFS with queue. Multiple approaches possible.",
      link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    },
  ])
  
  const mergedProblems = useMemo(() => rawProblems && rawProblems.length > 0 ? rawProblems : problems, [rawProblems, problems])
  const [filteredProblems, setFilteredProblems] = useState<CodingProblem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProblem, setNewProblem] = useState({
    title: "",
    platform: "LeetCode",
    difficulty: "easy",
    category: "",
    link: "",
    notes: "",
  })

  useEffect(() => {
    const filtered = mergedProblems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter
      const matchesStatus = statusFilter === "all" || problem.status === statusFilter
      const matchesPlatform = platformFilter === "all" || problem.platform === platformFilter
      return matchesSearch && matchesDifficulty && matchesStatus && matchesPlatform
    })
    setFilteredProblems(filtered)
  }, [mergedProblems, searchTerm, difficultyFilter, statusFilter, platformFilter])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "todo":
        return <Target className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const handleAddProblem = async () => {
    // Validation
    if (!newProblem.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem title.",
        variant: "destructive",
      })
      return
    }

    if (!newProblem.category.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem category (e.g., Array, Tree, String).",
        variant: "destructive",
      })
      return
    }

    try {
      const problem: CodingProblem = {
        _id: `${Date.now()}`,
        ...newProblem,
        difficulty: newProblem.difficulty as "easy" | "medium" | "hard",
        status: "todo",
        timeSpent: 0,
      }

      // Add to local state immediately
      setProblems([...problems, problem])

      // Try to sync with API (optional - won't fail locally)
      try {
        await apiCall("/api/coding", "POST", problem)
      } catch (apiError) {
        console.log("API sync failed, but problem saved locally")
      }

      setNewProblem({
        title: "",
        platform: "LeetCode",
        difficulty: "easy",
        category: "",
        link: "",
        notes: "",
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Problem added!",
        description: `${newProblem.title} has been added to your list.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add problem",
        variant: "destructive",
      })
    }
  }

  const updateProblemStatus = async (problemId: string, newStatus: "todo" | "in-progress" | "completed") => {
    try {
      // Update local state immediately
      setProblems(
        problems.map((p) =>
          p._id === problemId
            ? {
                ...p,
                status: newStatus,
                solvedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : p.solvedDate,
              }
            : p,
        ),
      )

      // Try to sync with API (optional - won't fail locally)
      try {
        await apiCall(`/api/coding/${problemId}`, "PUT", {
          status: newStatus,
          solvedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : undefined,
        })
      } catch (apiError) {
        console.log("API sync failed, but problem updated locally")
      }

      toast({
        title: "Status updated!",
        description: `Problem marked as ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update problem",
        variant: "destructive",
      })
    }
  }

  const stats = {
    total: mergedProblems.length,
    completed: mergedProblems.filter((p) => p.status === "completed").length,
    inProgress: mergedProblems.filter((p) => p.status === "in-progress").length,
    todo: mergedProblems.filter((p) => p.status === "todo").length,
    easy: mergedProblems.filter((p) => p.difficulty === "easy" && p.status === "completed").length,
    medium: mergedProblems.filter((p) => p.difficulty === "medium" && p.status === "completed").length,
    hard: mergedProblems.filter((p) => p.difficulty === "hard" && p.status === "completed").length,
    totalTime: mergedProblems.reduce((acc, p) => acc + (p.timeSpent || 0), 0),
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-full p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coding Practice</h1>
              <p className="text-gray-600 mt-1">Track your DSA problem solving progress</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Problem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Problem</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="title">Problem Title</Label>
                    <Input
                      id="title"
                      value={newProblem.title}
                      onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                      placeholder="e.g., Two Sum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={newProblem.platform}
                      onValueChange={(value) => setNewProblem({ ...newProblem, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LeetCode">LeetCode</SelectItem>
                        <SelectItem value="HackerRank">HackerRank</SelectItem>
                        <SelectItem value="CodeChef">CodeChef</SelectItem>
                        <SelectItem value="Codeforces">Codeforces</SelectItem>
                        <SelectItem value="GeeksforGeeks">GeeksforGeeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newProblem.difficulty}
                      onValueChange={(value) => setNewProblem({ ...newProblem, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newProblem.category}
                      onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                      placeholder="e.g., Array, Tree, Graph"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link">Problem URL</Label>
                    <Input
                      id="link"
                      value={newProblem.link}
                      onChange={(e) => setNewProblem({ ...newProblem, link: e.target.value })}
                      placeholder="https://leetcode.com/problems/..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newProblem.notes}
                      onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
                      placeholder="Any notes about the problem..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProblem}>Add Problem</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards - Horizontally Scrollable */}
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
                <p className="text-sm text-gray-600">To Do</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-green-600">{stats.easy}</p>
                <p className="text-sm text-gray-600">Easy</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-yellow-600">{stats.medium}</p>
                <p className="text-sm text-gray-600">Medium</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-red-600">{stats.hard}</p>
                <p className="text-sm text-gray-600">Hard</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Completion</span>
                    <span>{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search problems or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                    <SelectItem value="HackerRank">HackerRank</SelectItem>
                    <SelectItem value="CodeChef">CodeChef</SelectItem>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="GeeksforGeeks">GeeksforGeeks</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problems List - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {filteredProblems.map((problem) => (
              <Card key={problem._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        {problem.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{problem.platform}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(problem.status)}>
                        {getStatusIcon(problem.status)}
                        <span className="ml-1 capitalize">{problem.status}</span>
                      </Badge>
                      <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline">{problem.category}</Badge>
                    
                    {problem.solvedDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Solved on {new Date(problem.solvedDate).toLocaleDateString()}
                      </div>
                    )}

                    {problem.timeSpent && problem.timeSpent > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Time spent: {problem.timeSpent} minutes
                      </div>
                    )}

                    {problem.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 mb-1">Notes:</p>
                        <p className="text-sm text-blue-600">{problem.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        {problem.status === "todo" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProblemStatus(problem._id!, "in-progress")}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {problem.status === "in-progress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateProblemStatus(problem._id!, "completed")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                      {problem.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={problem.link} target="_blank" rel="noopener noreferrer">
                            View Problem →
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || platformFilter !== "all" || difficultyFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first coding problem."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Problem
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
