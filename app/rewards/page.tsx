"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedDate?: string
  category: "coding" | "applications" | "interviews" | "general"
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface DailyTask {
  id: number
  title: string
  description: string
  points: number
  completed: boolean
  category: "coding" | "applications" | "interviews" | "general"
}

interface Reward {
  id: number
  title: string
  description: string
  cost: number
  category: "templates" | "courses" | "tools" | "premium"
  available: boolean
}

export default function RewardsPage() {
  const { toast } = useToast()
  const [totalPoints] = useState(615)
  const [selectedTab, setSelectedTab] = useState("tasks")

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first coding problem",
      icon: "🎯",
      points: 10,
      unlocked: true,
      unlockedDate: "2024-01-10",
      category: "coding",
      rarity: "common",
    },
    {
      id: 2,
      title: "Problem Solver",
      description: "Solve 50 coding problems",
      icon: "🧩",
      points: 100,
      unlocked: true,
      unlockedDate: "2024-01-14",
      category: "coding",
      rarity: "rare",
    },
    {
      id: 3,
      title: "Application Master",
      description: "Apply to 25 companies",
      icon: "📋",
      points: 150,
      unlocked: false,
      category: "applications",
      rarity: "epic",
    },
    {
      id: 4,
      title: "Interview Ace",
      description: "Pass 10 interviews",
      icon: "🎤",
      points: 200,
      unlocked: false,
      category: "interviews",
      rarity: "legendary",
    },
    {
      id: 5,
      title: "Streak Master",
      description: "Maintain a 30-day practice streak",
      icon: "🔥",
      points: 300,
      unlocked: false,
      category: "general",
      rarity: "legendary",
    },
    {
      id: 6,
      title: "Early Bird",
      description: "Complete daily tasks for 7 consecutive days",
      icon: "🌅",
      points: 75,
      unlocked: true,
      unlockedDate: "2024-01-12",
      category: "general",
      rarity: "rare",
    },
  ])

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: 1,
      title: "Solve 3 coding problems",
      description: "Complete 3 problems on any platform",
      points: 30,
      completed: true,
      category: "coding",
    },
    {
      id: 2,
      title: "Apply to 2 companies",
      description: "Submit applications to 2 new companies",
      points: 40,
      completed: false,
      category: "applications",
    },
    {
      id: 3,
      title: "Practice aptitude for 30 minutes",
      description: "Spend at least 30 minutes on aptitude preparation",
      points: 25,
      completed: true,
      category: "general",
    },
    {
      id: 4,
      title: "Update your resume",
      description: "Make improvements to your resume",
      points: 20,
      completed: false,
      category: "general",
    },
    {
      id: 5,
      title: "Schedule an interview",
      description: "Schedule or complete an interview",
      points: 50,
      completed: false,
      category: "interviews",
    },
  ])

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 1,
      title: "Premium Resume Template",
      description: "Access to professional resume templates",
      cost: 100,
      category: "templates",
      available: true,
    },
    {
      id: 2,
      title: "System Design Course",
      description: "Complete system design interview course",
      cost: 500,
      category: "courses",
      available: true,
    },
    {
      id: 3,
      title: "Mock Interview Session",
      description: "1-on-1 mock interview with expert",
      cost: 800,
      category: "premium",
      available: true,
    },
    {
      id: 4,
      title: "Coding Interview Toolkit",
      description: "Collection of coding interview resources",
      cost: 300,
      category: "tools",
      available: true,
    },
    {
      id: 5,
      title: "Premium Dashboard Theme",
      description: "Unlock premium dashboard themes",
      cost: 150,
      category: "premium",
      available: true,
    },
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completeTask = (taskId: number) => {
    setDailyTasks(
      dailyTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    )
    const task = dailyTasks.find((t) => t.id === taskId)
    toast({
      title: "Task Completed!",
      description: `You earned ${task?.points} points!`,
    })
  }

  const claimReward = (rewardId: number) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (totalPoints >= (reward?.cost || 0)) {
      toast({
        title: "Reward Claimed!",
        description: `You've claimed ${reward?.title}!`,
      })
    } else {
      toast({
        title: "Not Enough Points",
        description: `You need ${(reward?.cost || 0) - totalPoints} more points`,
        variant: "destructive",
      })
    }
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const completedCount = dailyTasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Rewards & Achievements
          </h1>
          <p className="text-slate-600">
            Track your progress, complete tasks, and unlock rewards
          </p>
        </div>

        {/* Points Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Total Points
                </p>
                <p className="text-5xl font-bold">{totalPoints}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Achievements Unlocked</p>
                <p className="text-3xl font-bold">
                  {unlockedCount}/{achievements.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
          </TabsList>

          {/* Daily Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="grid gap-4">
              {dailyTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`p-4 border-2 ${
                    task.completed
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-slate-900">
                          {task.title}
                        </h3>
                        <Badge variant="outline" className="bg-slate-100">
                          +{task.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {task.description}
                      </p>
                    </div>
                    {!task.completed && (
                      <Button
                        onClick={() => completeTask(task.id)}
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                      >
                        Complete
                      </Button>
                    )}
                    {task.completed && (
                      <div className="ml-4 text-green-600 font-semibold">
                        ✓ Done
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              You have completed {completedCount} out of {dailyTasks.length}{" "}
              daily tasks today.
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`p-4 border-2 ${
                    achievement.unlocked
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200 opacity-60"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        className={getRarityColor(achievement.rarity)}
                        variant="secondary"
                      >
                        {achievement.rarity}
                      </Badge>
                      <Badge variant="outline">+{achievement.points}</Badge>
                    </div>
                    {achievement.unlocked && (
                      <p className="text-xs text-green-600 mt-3 font-medium">
                        Unlocked on {achievement.unlockedDate}
                      </p>
                    )}
                    {!achievement.unlocked && (
                      <p className="text-xs text-slate-500 mt-3">Locked</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rewards Store Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className="p-4 border-2 border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {reward.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {reward.cost} pts
                      </Badge>
                    </div>
                    <Button
                      onClick={() => claimReward(reward.id)}
                      disabled={totalPoints < reward.cost}
                      className={
                        totalPoints >= reward.cost
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      Claim
                    </Button>
                  </div>
                  {totalPoints < reward.cost && (
                    <p className="text-xs text-slate-500 mt-2">
                      Need {reward.cost - totalPoints} more points
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
