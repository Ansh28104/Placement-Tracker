"use client"

import { useState } from "react"
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
import { Brain, Plus, Search, Calendar, Clock, CheckCircle, Target, TrendingUp, BookOpen, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AptitudeTest {
  id: number
  title: string
  category: "quantitative" | "logical" | "verbal" | "general"
  difficulty: "easy" | "medium" | "hard"
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  maxTime: number
  score: number
  completedDate?: string
  status: "completed" | "in-progress" | "planned"
  notes: string
}

interface Question {
  id: number
  text: string
  options: string[]
  correct: number
  userAnswer?: number
}

export default function AptitudePage() {
  const { toast } = useToast()
  const [tests, setTests] = useState<AptitudeTest[]>([
    {
      id: 1,
      title: "Quantitative Aptitude - Basic",
      category: "quantitative",
      difficulty: "easy",
      totalQuestions: 20,
      correctAnswers: 16,
      timeSpent: 25,
      maxTime: 30,
      score: 80,
      completedDate: "2024-01-15",
      status: "completed",
      notes: "Good performance in arithmetic problems. Need to work on geometry.",
    },
    {
      id: 2,
      title: "Logical Reasoning - Patterns",
      category: "logical",
      difficulty: "medium",
      totalQuestions: 15,
      correctAnswers: 12,
      timeSpent: 20,
      maxTime: 25,
      score: 80,
      completedDate: "2024-01-14",
      status: "completed",
      notes: "Pattern recognition was challenging. Practice more sequence problems.",
    },
    {
      id: 3,
      title: "Verbal Ability - Reading Comprehension",
      category: "verbal",
      difficulty: "medium",
      totalQuestions: 25,
      correctAnswers: 20,
      timeSpent: 35,
      maxTime: 40,
      score: 80,
      completedDate: "2024-01-13",
      status: "completed",
      notes: "Good vocabulary but need to improve reading speed.",
    },
    {
      id: 4,
      title: "Data Interpretation - Advanced",
      category: "quantitative",
      difficulty: "hard",
      totalQuestions: 20,
      correctAnswers: 0,
      timeSpent: 15,
      maxTime: 45,
      score: 0,
      status: "in-progress",
      notes: "Started but need more time to complete.",
    },
    {
      id: 5,
      title: "General Knowledge - Current Affairs",
      category: "general",
      difficulty: "easy",
      totalQuestions: 30,
      correctAnswers: 0,
      timeSpent: 0,
      maxTime: 30,
      score: 0,
      status: "planned",
      notes: "Scheduled for this weekend.",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPracticeDialogOpen, setIsPracticeDialogOpen] = useState(false)
  const [selectedTestForPractice, setSelectedTestForPractice] = useState<AptitudeTest | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [practiceAnswers, setPracticeAnswers] = useState<(number | null)[]>([])
  const [practiceSampleQuestions, setPracticeSampleQuestions] = useState<Question[]>([])
  const [newTest, setNewTest] = useState({
    title: "",
    category: "quantitative",
    difficulty: "easy",
    totalQuestions: "",
    maxTime: "",
    notes: "",
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "quantitative":
        return "bg-blue-100 text-blue-800"
      case "logical":
        return "bg-purple-100 text-purple-800"
      case "verbal":
        return "bg-green-100 text-green-800"
      case "general":
        return "bg-orange-100 text-orange-800"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "planned":
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
      case "planned":
        return <Target className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  // Safe number conversion utility
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value)
    return Number.isNaN(num) ? defaultValue : num
  }

  // Sample questions database
  const generateSampleQuestions = (test: AptitudeTest): Question[] => {
    const questions: Question[] = []

    if (test.category === "quantitative") {
      questions.push(
        {
          id: 1,
          text: "If a number is increased by 20%, and then decreased by 20%, what is the net change?",
          options: ["No change", "4% decrease", "4% increase", "20% decrease"],
          correct: 1,
        },
        {
          id: 2,
          text: "What is the probability of getting a sum of 7 when rolling two dice?",
          options: ["1/6", "1/12", "2/12", "1/36"],
          correct: 0,
        },
        {
          id: 3,
          text: "If the ratio of A:B is 3:4 and B:C is 2:5, what is A:B:C?",
          options: ["3:4:10", "6:8:20", "3:2:5", "4:3:5"],
          correct: 1,
        },
      )
    } else if (test.category === "logical") {
      questions.push(
        {
          id: 1,
          text: "Find the missing number in the series: 2, 6, 12, 20, ?",
          options: ["28", "30", "32", "36"],
          correct: 1,
        },
        {
          id: 2,
          text: "If all cats are animals, and Fluffy is a cat, then Fluffy is an animal. This is an example of:",
          options: ["Deductive reasoning", "Inductive reasoning", "Abductive reasoning", "Analogical reasoning"],
          correct: 0,
        },
        {
          id: 3,
          text: "Which figure completes the pattern? (Pattern based logic)",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 2,
        },
      )
    } else if (test.category === "verbal") {
      questions.push(
        {
          id: 1,
          text: "Choose the word that is most nearly opposite in meaning to EPHEMERAL",
          options: ["Lasting", "Enduring", "Permanent", "All of the above"],
          correct: 3,
        },
        {
          id: 2,
          text: "Select the correctly spelled word:",
          options: ["Ocassion", "Occasion", "Ocasion", "Occassion"],
          correct: 1,
        },
        {
          id: 3,
          text: "What does the phrase 'to burn bridges' mean?",
          options: ["To set fires", "To destroy relationships", "To create problems", "To start new projects"],
          correct: 1,
        },
      )
    } else {
      questions.push(
        {
          id: 1,
          text: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: 1,
        },
        {
          id: 2,
          text: "Who was the first President of India?",
          options: ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Pratibha Patil"],
          correct: 1,
        },
        {
          id: 3,
          text: "In which year did the Titanic sink?",
          options: ["1912", "1915", "1920", "1900"],
          correct: 0,
        },
      )
    }

    return questions
  }

  const openPracticeMode = (test: AptitudeTest) => {
    const questions = generateSampleQuestions(test)
    setPracticeSampleQuestions(questions)
    setSelectedTestForPractice(test)
    setPracticeAnswers(new Array(questions.length).fill(null))
    setCurrentQuestionIndex(0)
    setIsPracticeDialogOpen(true)
  }

  const handlePracticeAnswer = (answerIndex: number) => {
    const newAnswers = [...practiceAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setPracticeAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < practiceSampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const submitPractice = () => {
    const correctCount = practiceAnswers.filter(
      (answer, idx) => answer === practiceSampleQuestions[idx].correct,
    ).length
    const score = Math.round((correctCount / practiceSampleQuestions.length) * 100)

    toast({
      title: "Practice Completed! 🎉",
      description: `You scored ${score}% (${correctCount}/${practiceSampleQuestions.length} correct)`,
    })

    setIsPracticeDialogOpen(false)
    setPracticeAnswers([])
    setCurrentQuestionIndex(0)
    setPracticeSampleQuestions([])
  }

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || test.category === categoryFilter
    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    const matchesDifficulty = difficultyFilter === "all" || test.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty
  })

  const handleAddTest = () => {
    const totalQuestions = Number.parseInt(newTest.totalQuestions) || 0
    const maxTime = Number.parseInt(newTest.maxTime) || 0

    if (!newTest.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test title.",
        variant: "destructive",
      })
      return
    }

    if (totalQuestions <= 0 || maxTime <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid number of questions and max time.",
        variant: "destructive",
      })
      return
    }

    const test: AptitudeTest = {
      ...newTest,
      id: tests.length + 1,
      category: newTest.category as "quantitative" | "logical" | "verbal" | "general",
      difficulty: newTest.difficulty as "easy" | "medium" | "hard",
      totalQuestions,
      maxTime,
      correctAnswers: 0,
      timeSpent: 0,
      score: 0,
      status: "planned",
    }

    setTests([...tests, test])
    setNewTest({
      title: "",
      category: "quantitative",
      difficulty: "easy",
      totalQuestions: "",
      maxTime: "",
      notes: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Test added!",
      description: "New aptitude test has been added to your list.",
    })
  }

  const updateTestStatus = (testId: number, newStatus: "completed" | "in-progress" | "planned") => {
    setTests(
      tests.map((test) =>
        test.id === testId
          ? {
              ...test,
              status: newStatus,
              completedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : test,
      ),
    )
    toast({
      title: "Status updated!",
      description: `Test marked as ${newStatus}.`,
    })
  }

  const stats = {
    total: tests.length,
    completed: tests.filter((t) => t.status === "completed").length,
    inProgress: tests.filter((t) => t.status === "in-progress").length,
    planned: tests.filter((t) => t.status === "planned").length,
    avgScore:
      tests.filter((t) => t.status === "completed").length > 0
        ? Math.round(
            tests.filter((t) => t.status === "completed").reduce((acc, t) => acc + safeNumber(t.score), 0) /
              tests.filter((t) => t.status === "completed").length,
          )
        : 0,
    totalTime: tests.reduce((acc, t) => acc + safeNumber(t.timeSpent), 0),
    quantitative: tests.filter((t) => t.category === "quantitative" && t.status === "completed").length,
    logical: tests.filter((t) => t.category === "logical" && t.status === "completed").length,
    verbal: tests.filter((t) => t.category === "verbal" && t.status === "completed").length,
    general: tests.filter((t) => t.category === "general" && t.status === "completed").length,
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aptitude Preparation</h1>
              <p className="text-gray-600 mt-1">Track your quantitative, logical, and verbal aptitude progress</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Aptitude Test</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="title">Test Title</Label>
                    <Input
                      id="title"
                      value={newTest.title}
                      onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      placeholder="e.g., Quantitative Aptitude - Basic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTest.category}
                      onValueChange={(value) => setNewTest({ ...newTest, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quantitative">Quantitative</SelectItem>
                        <SelectItem value="logical">Logical Reasoning</SelectItem>
                        <SelectItem value="verbal">Verbal Ability</SelectItem>
                        <SelectItem value="general">General Knowledge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newTest.difficulty}
                      onValueChange={(value) => setNewTest({ ...newTest, difficulty: value })}
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
                    <Label htmlFor="totalQuestions">Total Questions</Label>
                    <Input
                      id="totalQuestions"
                      type="number"
                      value={newTest.totalQuestions}
                      onChange={(e) => setNewTest({ ...newTest, totalQuestions: e.target.value })}
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxTime">Max Time (minutes)</Label>
                    <Input
                      id="maxTime"
                      type="number"
                      value={newTest.maxTime}
                      onChange={(e) => setNewTest({ ...newTest, maxTime: e.target.value })}
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newTest.notes}
                      onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
                      placeholder="Any notes about the test..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTest}>Add Test</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Tests</p>
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
                <p className="text-2xl font-bold text-purple-600">{stats.avgScore}%</p>
                <p className="text-sm text-gray-600">Avg Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-blue-600">{stats.quantitative}</p>
                <p className="text-sm text-gray-600">Quant</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-purple-600">{stats.logical}</p>
                <p className="text-sm text-gray-600">Logical</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-lg font-bold text-green-600">{stats.verbal}</p>
                <p className="text-sm text-gray-600">Verbal</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalTime}</p>
                    <p className="text-sm text-gray-600">Minutes Practiced</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{stats.avgScore}%</p>
                    <p className="text-sm text-gray-600">Average Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{Math.round(completionRate)}%</p>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                  </div>
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
                      placeholder="Search tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="quantitative">Quantitative</SelectItem>
                    <SelectItem value="logical">Logical</SelectItem>
                    <SelectItem value="verbal">Verbal</SelectItem>
                    <SelectItem value="general">General</SelectItem>
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
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tests List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        {test.title}
                      </CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(test.status)}>
                        {getStatusIcon(test.status)}
                        <span className="ml-1 capitalize">{test.status.replace("-", " ")}</span>
                      </Badge>
                      <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(test.category)} variant="outline">
                        {test.category}
                      </Badge>
                      {test.status === "completed" && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{safeNumber(test.score)}%</p>
                          <p className="text-xs text-gray-600">Score</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Questions</p>
                        <p className="font-medium">
                          {test.status === "completed"
                            ? `${safeNumber(test.correctAnswers)}/${safeNumber(test.totalQuestions)}`
                            : `${safeNumber(test.totalQuestions)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time</p>
                        <p className="font-medium">
                          {test.timeSpent > 0 ? `${safeNumber(test.timeSpent)}/${safeNumber(test.maxTime)} min` : `${safeNumber(test.maxTime)} min`}
                        </p>
                      </div>
                    </div>

                    {test.status === "completed" && safeNumber(test.totalQuestions) > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Accuracy</span>
                          <span>{Math.round((safeNumber(test.correctAnswers) / safeNumber(test.totalQuestions)) * 100)}%</span>
                        </div>
                        <Progress value={(safeNumber(test.correctAnswers) / safeNumber(test.totalQuestions)) * 100} className="h-2" />
                      </div>
                    )}

                    {test.completedDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Completed: {new Date(test.completedDate).toLocaleDateString()}
                      </div>
                    )}

                    {test.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{test.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        {test.status !== "completed" && (
                          <Button variant="outline" size="sm" onClick={() => updateTestStatus(test.id, "completed")}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        {test.status === "planned" && (
                          <Button variant="outline" size="sm" onClick={() => updateTestStatus(test.id, "in-progress")}>
                            <Clock className="w-4 h-4 mr-1" />
                            Start Test
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPracticeMode(test)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Practice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || difficultyFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first aptitude test."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Test
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Practice Mode Dialog */}
          <Dialog open={isPracticeDialogOpen} onOpenChange={setIsPracticeDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Practice Mode: {selectedTestForPractice?.title}
                </DialogTitle>
              </DialogHeader>

              {selectedTestForPractice && practiceSampleQuestions.length > 0 && (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">
                        Question {currentQuestionIndex + 1} of {practiceSampleQuestions.length}
                      </span>
                      <span className="text-gray-600">
                        Answered: {practiceAnswers.filter((a) => a !== null).length}/{practiceSampleQuestions.length}
                      </span>
                    </div>
                    <Progress value={((currentQuestionIndex + 1) / practiceSampleQuestions.length) * 100} className="h-2" />
                  </div>

                  {/* Current Question */}
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {practiceSampleQuestions[currentQuestionIndex].text}
                    </h3>

                    {/* Options */}
                    <div className="space-y-2">
                      {practiceSampleQuestions[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePracticeAnswer(idx)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                            practiceAnswers[currentQuestionIndex] === idx
                              ? "bg-blue-100 border-blue-500"
                              : "bg-white border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="ml-2">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Answer Indicator */}
                  {practiceAnswers[currentQuestionIndex] !== null ? (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-blue-700">
                        You selected option {String.fromCharCode(65 + practiceAnswers[currentQuestionIndex])}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-yellow-700">Select an option to answer this question</span>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-3">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      ← Previous
                    </Button>

                    <div className="flex gap-2 flex-wrap justify-center">
                      {practiceSampleQuestions.map((_, idx) => (
                        <Button
                          key={idx}
                          variant={currentQuestionIndex === idx ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-10 h-10 p-0 ${
                            practiceAnswers[idx] !== null ? "bg-green-100 text-green-800 border-green-300" : ""
                          }`}
                        >
                          {idx + 1}
                        </Button>
                      ))}
                    </div>

                    {currentQuestionIndex === practiceSampleQuestions.length - 1 ? (
                      <Button
                        onClick={submitPractice}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Submit Practice
                      </Button>
                    ) : (
                      <Button onClick={goToNextQuestion} className="bg-blue-600 hover:bg-blue-700">
                        Next →
                      </Button>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    <p>
                      <strong>Category:</strong> {selectedTestForPractice.category} |{" "}
                      <strong>Difficulty:</strong> {selectedTestForPractice.difficulty}
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
