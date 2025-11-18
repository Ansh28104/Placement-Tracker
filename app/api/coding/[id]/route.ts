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

// PUT: Update a coding problem
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    const client = await clientPromise
    const db = client.db("placement-tracker")
    const result = await db.collection("coding-problems").findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updates },
      { returnDocument: "after" }
    )

    if (!result.value) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Error updating coding problem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE: Delete a coding problem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const client = await clientPromise
    const db = client.db("placement-tracker")
    const result = await db
      .collection("coding-problems")
      .deleteOne({ _id: new ObjectId(id), userId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting coding problem:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
