import clientPromise from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string
    }
    return decoded.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("placement-tracker")
    const applications = await db
      .collection("applications")
      .find({ userId })
      .sort({ appliedDate: -1 })
      .toArray()

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const client = await clientPromise
    const db = client.db("placement-tracker")
    const result = await db.collection("applications").insertOne({
      ...body,
      userId,
      appliedDate: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...body,
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
