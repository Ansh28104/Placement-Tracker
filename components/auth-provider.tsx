"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  points: number
  level: number
  streak: number
  joinDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  addPoints: (points: number) => void
  updateStreak: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("placement-tracker-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isAuthPage = pathname?.startsWith("/auth")

      if (!user && !isAuthPage) {
        router.push("/auth/login")
      } else if (user && isAuthPage) {
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Login error:", error.error || JSON.stringify(error))
        alert(`Login failed: ${error.error || 'Unknown error'}`)
        return false
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("placement-tracker-user", JSON.stringify(data.user))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Signup error:", error.error || JSON.stringify(error))
        alert(`Signup failed: ${error.error || 'Unknown error'}`)
        return false
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("placement-tracker-user", JSON.stringify(data.user))
      return true
    } catch (error) {
      console.error("Signup failed:", error)
      alert(`Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("placement-tracker-user")
    router.push("/auth/login")
  }

  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        points: user.points + points,
        level: Math.floor((user.points + points) / 500) + 1,
      }
      setUser(updatedUser)
      localStorage.setItem("placement-tracker-user", JSON.stringify(updatedUser))
    }
  }

  const updateStreak = () => {
    if (user) {
      const updatedUser = { ...user, streak: user.streak + 1 }
      setUser(updatedUser)
      localStorage.setItem("placement-tracker-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        addPoints,
        updateStreak,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
