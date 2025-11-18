// User model
export interface User {
  _id?: string
  name: string
  email: string
  password: string
  points: number
  level: number
  streak: number
  joinDate: string
  createdAt?: Date
}

// Coding problem
export interface CodingProblem {
  _id?: string
  userId: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  platform: string
  status: "todo" | "in-progress" | "completed"
  notes: string
  link?: string
  createdAt?: Date
}

// Application
export interface JobApplication {
  _id?: string
  userId: string
  company: string
  position: string
  status: "applied" | "shortlisted" | "interview" | "offer" | "rejected"
  appliedDate: string
  salary?: string
  link?: string
  createdAt?: Date
}

// Interview
export interface Interview {
  _id?: string
  userId: string
  company: string
  round: string
  date: string
  time: string
  type: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  createdAt?: Date
}

// Goal
export interface Goal {
  _id?: string
  userId: string
  title: string
  description: string
  category: string
  target: string
  progress: number
  dueDate: string
  status: "active" | "completed" | "abandoned"
  createdAt?: Date
}

// Resource
export interface Resource {
  _id?: string
  userId: string
  title: string
  type: string
  url: string
  category: string
  isSaved: boolean
  createdAt?: Date
}

// Aptitude Test
export interface AptitudeTest {
  _id?: string
  userId: string
  testName: string
  score: number
  totalScore: number
  category: string
  date: string
  duration: number
  createdAt?: Date
}
