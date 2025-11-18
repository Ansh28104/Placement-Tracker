"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, Calendar, CheckCircle, Clock, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Goal {
  id: number
  title: string
  description: string
  category: string
  targetValue: number
  currentValue: number
  deadline: string
  status: "active" | "completed" | "overdue"
  priority: "low" | "medium" | "high"
}

export default function GoalsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Apply to 50 Companies",
      description: "Submit applications to 50 different companies by end of month",
      category: "applications",
      targetValue: 50,
      currentValue: 25,
      deadline: "2024-02-29",
      status: "active",
      priority: "high",
    },
    {
      id: 2,
      title: "Solve 200 Coding Problems",
      description: "Complete 200 DSA problems across different difficulty levels",
      category: "coding",
      targetValue: 200,
      currentValue: 150,
      deadline: "2024-03-15",
      status: "active",
      priority: "medium",
    },
    {
      id: 3,
      title: "Complete Mock Interviews",
      description: "Participate in 10 mock interview sessions",
      category: "interviews",
      targetValue: 10,
      currentValue: 10,
      deadline: "2024-01-31",
      status: "completed",
      priority: "high",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetValue: "",
    deadline: "",
    priority: "medium",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingGoal) {
      // Update existing goal
      setGoals(
        goals.map((goal) =>
          goal.id === editingGoal.id
            ? {
                ...goal,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                targetValue: Number.parseInt(formData.targetValue),
                deadline: formData.deadline,
                priority: formData.priority as "low" | "medium" | "high",
              }
            : goal,
        ),
      )
      toast({
        title: "Goal updated!",
        description: "Your goal has been successfully updated.",
      })
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetValue: Number.parseInt(formData.targetValue),
        currentValue: 0,
        deadline: formData.deadline,
        status: "active",
        priority: formData.priority as "low" | "medium" | "high",
      }
      setGoals([...goals, newGoal])
      toast({
        title: "Goal created!",
        description: "Your new goal has been added successfully.",
      })
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      targetValue: "",
      deadline: "",
      priority: "medium",
    })
    setEditingGoal(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetValue: goal.targetValue.toString(),
      deadline: goal.deadline,
      priority: goal.priority,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (goalId: number) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
    toast({
      title: "Goal deleted",
      description: "The goal has been removed from your list.",
    })
  }

  const updateProgress = (goalId: number, newValue: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              currentValue: Math.min(newValue, goal.targetValue),
              status: newValue >= goal.targetValue ? "completed" : goal.status,
            }
          : goal,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeGoals = goals.filter((goal) => goal.status === "active")
  const completedGoals = goals.filter((goal) => goal.status === "completed")
  const overallProgress = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Goals & Targets</h1>
              <p className="text-gray-600 mt-1">Set and track your placement preparation goals</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingGoal(null)
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      targetValue: "",
                      deadline: "",
                      priority: "medium",
                    })
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
                  <DialogDescription>
                    {editingGoal ? "Update your goal details" : "Set a new goal to track your progress"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Apply to 50 companies"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your goal in detail"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applications">Applications</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                          <SelectItem value="aptitude">Aptitude</SelectItem>
                          <SelectItem value="interviews">Interviews</SelectItem>
                          <SelectItem value="resume">Resume</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetValue">Target Value</Label>
                      <Input
                        id="targetValue"
                        type="number"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                        placeholder="e.g., 50"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingGoal ? "Update Goal" : "Create Goal"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Goals</p>
                    <p className="text-2xl font-bold">{goals.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Goals</p>
                    <p className="text-2xl font-bold">{activeGoals.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{completedGoals.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Goals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const progress = (goal.currentValue / goal.targetValue) * 100
                const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== "completed"

                return (
                  <Card key={goal.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(isOverdue ? "overdue" : goal.status)}>
                          {isOverdue ? "Overdue" : goal.status}
                        </Badge>
                        <Badge className={getPriorityColor(goal.priority)}>{goal.priority} priority</Badge>
                        <Badge variant="outline">{goal.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>
                              {goal.currentValue} / {goal.targetValue}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}% complete</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </div>
                          {goal.status === "active" && (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max={goal.targetValue}
                                defaultValue={goal.currentValue}
                                className="w-20 h-8"
                                onBlur={(e) => updateProgress(goal.id, Number.parseInt(e.target.value) || 0)}
                              />
                              <Button size="sm" onClick={() => updateProgress(goal.id, goal.currentValue + 1)}>
                                +1
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
