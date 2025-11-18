"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  ExternalLink,
  Search,
  Star,
  Users,
  Play,
  FileText,
  Code,
  Brain,
  Building2,
  MessageSquare,
} from "lucide-react"

const resources = [
  {
    id: 1,
    title: "LeetCode",
    description: "Practice coding problems with detailed solutions",
    url: "https://leetcode.com",
    category: "coding",
    type: "platform",
    rating: 4.8,
    users: "50M+",
    free: true,
  },
  {
    id: 2,
    title: "GeeksforGeeks",
    description: "Comprehensive DSA tutorials and practice problems",
    url: "https://geeksforgeeks.org",
    category: "coding",
    type: "tutorial",
    rating: 4.6,
    users: "30M+",
    free: true,
  },
  {
    id: 3,
    title: "Cracking the Coding Interview",
    description: "Essential book for technical interview preparation",
    url: "#",
    category: "interviews",
    type: "book",
    rating: 4.9,
    users: "1M+",
    free: false,
  },
  {
    id: 4,
    title: "Glassdoor",
    description: "Company reviews, salaries, and interview experiences",
    url: "https://glassdoor.com",
    category: "applications",
    type: "platform",
    rating: 4.4,
    users: "67M+",
    free: true,
  },
  {
    id: 5,
    title: "IndiaBix Aptitude",
    description: "Quantitative aptitude and logical reasoning practice",
    url: "https://indiabix.com",
    category: "aptitude",
    type: "platform",
    rating: 4.3,
    users: "10M+",
    free: true,
  },
  {
    id: 6,
    title: "System Design Primer",
    description: "Learn how to design large-scale systems",
    url: "https://github.com/donnemartin/system-design-primer",
    category: "interviews",
    type: "tutorial",
    rating: 4.8,
    users: "200K+",
    free: true,
  },
  {
    id: 7,
    title: "Naukri.com",
    description: "India's leading job portal for applications",
    url: "https://naukri.com",
    category: "applications",
    type: "platform",
    rating: 4.2,
    users: "70M+",
    free: true,
  },
  {
    id: 8,
    title: "HackerRank",
    description: "Coding challenges and skill assessments",
    url: "https://hackerrank.com",
    category: "coding",
    type: "platform",
    rating: 4.5,
    users: "40M+",
    free: true,
  },
  {
    id: 9,
    title: "InterviewBit",
    description: "Structured programming interview preparation",
    url: "https://interviewbit.com",
    category: "interviews",
    type: "platform",
    rating: 4.6,
    users: "3M+",
    free: true,
  },
  {
    id: 10,
    title: "Coursera - Algorithms",
    description: "Princeton University's algorithms course",
    url: "https://coursera.org",
    category: "coding",
    type: "course",
    rating: 4.9,
    users: "500K+",
    free: false,
  },
]

const categories = [
  { id: "all", name: "All Resources", icon: BookOpen },
  { id: "coding", name: "Coding", icon: Code },
  { id: "aptitude", name: "Aptitude", icon: Brain },
  { id: "applications", name: "Applications", icon: Building2 },
  { id: "interviews", name: "Interviews", icon: MessageSquare },
]

const types = [
  { id: "all", name: "All Types" },
  { id: "platform", name: "Platforms" },
  { id: "tutorial", name: "Tutorials" },
  { id: "course", name: "Courses" },
  { id: "book", name: "Books" },
]

export default function ResourcesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([1, 3, 6])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const toggleFavorite = (resourceId: number) => {
    setFavorites((prev) => (prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId]))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "platform":
        return <ExternalLink className="w-4 h-4" />
      case "course":
        return <Play className="w-4 h-4" />
      case "book":
        return <FileText className="w-4 h-4" />
      case "tutorial":
        return <BookOpen className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "platform":
        return "bg-blue-100 text-blue-800"
      case "course":
        return "bg-purple-100 text-purple-800"
      case "book":
        return "bg-green-100 text-green-800"
      case "tutorial":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
            <p className="text-gray-600 mt-2">Curated resources to boost your placement preparation</p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid w-full grid-cols-5">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-1">
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{category.name}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>

                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.id)}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{resource.title}</span>
                        {!resource.free && (
                          <Badge variant="secondary" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(resource.id)}
                      className={favorites.includes(resource.id) ? "text-yellow-500" : "text-gray-400"}
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(resource.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(resource.type)}>
                        {getTypeIcon(resource.type)}
                        <span className="ml-1 capitalize">{resource.type}</span>
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{resource.users} users</span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {resource.category}
                      </Badge>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => window.open(resource.url, "_blank")}
                      disabled={resource.url === "#"}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {resource.url === "#" ? "Coming Soon" : "Visit Resource"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
                  <p className="text-sm text-gray-600">Total Resources</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{resources.filter((r) => r.free).length}</p>
                  <p className="text-sm text-gray-600">Free Resources</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {resources.filter((r) => r.type === "course").length}
                  </p>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{favorites.length}</p>
                  <p className="text-sm text-gray-600">Your Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
