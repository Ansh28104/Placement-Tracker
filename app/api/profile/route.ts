import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user123"

    // Mock user profile data
    const profile = {
      _id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
      bio: "Passionate about placement preparation",
      phone: "+91 (555) 123-4567",
      university: "IIT Delhi",
      branch: "Computer Science & Engineering",
      graduationYear: 2024,
      joinDate: new Date("2024-01-15"),
      points: 4250,
      level: 12,
      streak: 28,
      avatar: "/placeholder.svg?height=96&width=96",
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user123"
    const body = await request.json()

    // In a real app, you would save this to the database
    const updatedProfile = {
      _id: userId,
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
