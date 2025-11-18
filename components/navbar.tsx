"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Building2,
  Code,
  Brain,
  FileText,
  MessageSquare,
  Trophy,
  Target,
  BookOpen,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Flame,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Applications", href: "/applications", icon: Building2 },
  { name: "Coding", href: "/coding", icon: Code },
  { name: "Aptitude", href: "/aptitude", icon: Brain },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Interviews", href: "/interviews", icon: MessageSquare },
  { name: "Rewards", href: "/rewards", icon: Trophy },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Resources", href: "/resources", icon: BookOpen },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) return null

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                PlacementTracker
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Points and Streak */}
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">{user.points}</span>
              </div>
              <div className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">{user.streak}</span>
              </div>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Level {user.level}</span>
                      <span className="text-xs text-muted-foreground">{user.points} points</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile Points and Streak */}
            <div className="flex items-center justify-between px-3 py-2 mt-4 pt-4 border-t">
              <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-2 rounded-full">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">{user.points} points</span>
              </div>
              <div className="flex items-center space-x-1 bg-orange-50 px-3 py-2 rounded-full">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">{user.streak} streak</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
