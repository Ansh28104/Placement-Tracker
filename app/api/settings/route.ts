import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user123"

    // Mock settings data
    const settings = {
      userId,
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        goalReminders: true,
        interviewReminders: true,
        achievementNotifications: true,
        weeklyDigest: false,
      },
      privacy: {
        profileVisibility: "public",
        showActivity: true,
        allowMessages: true,
        allowFriendRequests: true,
      },
      appearance: {
        theme: "auto",
        fontSize: "medium",
        compactMode: false,
      },
    }

    return NextResponse.json(settings, { status: 200 })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user123"
    const body = await request.json()

    // In a real app, you would save this to the database
    const updatedSettings = {
      userId,
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json(updatedSettings, { status: 200 })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
