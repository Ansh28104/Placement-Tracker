import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
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

// GET: Fetch all coding problems for the user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("placement-tracker")
    const problems = await db
      .collection("coding-problems")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(problems)
  } catch (error) {
    console.error("Error fetching coding problems:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST: Create a new coding problem
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, difficulty, platform, status, notes, link } =
      await request.json()

    const client = await clientPromise
    const db = client.db("placement-tracker")
    const result = await db.collection("coding-problems").insertOne({
      userId,
      title,
      difficulty,
      platform,
      status,
      notes,
      link,
      createdAt: new Date(),
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      userId,
      title,
      difficulty,
      platform,
      status,
      notes,
      link,
    })
  } catch (error) {
    console.error("Error creating coding problem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
