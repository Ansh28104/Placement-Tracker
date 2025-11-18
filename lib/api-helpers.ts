import { apiCall } from "@/hooks/use-api"
import type { CodingProblem, JobApplication, Interview, Goal } from "@/lib/db-models"

export async function fetchCodingProblems() {
  return apiCall<CodingProblem[]>("/api/coding")
}

export async function createCodingProblem(problem: Omit<CodingProblem, "_id">) {
  return apiCall<CodingProblem>("/api/coding", "POST", problem)
}

export async function updateCodingProblem(id: string, updates: Partial<CodingProblem>) {
  return apiCall(`/api/coding/${id}`, "PUT", updates)
}

export async function deleteCodingProblem(id: string) {
  return apiCall(`/api/coding/${id}`, "DELETE")
}

export async function fetchApplications() {
  return apiCall<JobApplication[]>("/api/applications")
}

export async function createApplication(app: Omit<JobApplication, "_id">) {
  return apiCall<JobApplication>("/api/applications", "POST", app)
}

export async function updateApplication(id: string, updates: Partial<JobApplication>) {
  return apiCall(`/api/applications/${id}`, "PUT", updates)
}

export async function deleteApplication(id: string) {
  return apiCall(`/api/applications/${id}`, "DELETE")
}

export async function fetchInterviews() {
  return apiCall<Interview[]>("/api/interviews")
}

export async function createInterview(interview: Omit<Interview, "_id">) {
  return apiCall<Interview>("/api/interviews", "POST", interview)
}

export async function updateInterview(id: string, updates: Partial<Interview>) {
  return apiCall(`/api/interviews/${id}`, "PUT", updates)
}

export async function deleteInterview(id: string) {
  return apiCall(`/api/interviews/${id}`, "DELETE")
}

export async function fetchGoals() {
  return apiCall<Goal[]>("/api/goals")
}

export async function createGoal(goal: Omit<Goal, "_id">) {
  return apiCall<Goal>("/api/goals", "POST", goal)
}

export async function updateGoal(id: string, updates: Partial<Goal>) {
  return apiCall(`/api/goals/${id}`, "PUT", updates)
}

export async function deleteGoal(id: string) {
  return apiCall(`/api/goals/${id}`, "DELETE")
}
