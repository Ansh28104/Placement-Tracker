import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server"

const COLLECTION_NAME = "resumes"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB()
    const collection = db.collection(COLLECTION_NAME)

    const resume = await collection.findOne({
      _id: new ObjectId(params.id),
    })

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { title, type, targetRole, company, notes, status, rating, fileName } = body

    const db = await connectDB()
    const collection = db.collection(COLLECTION_NAME)

    const updateData: Record<string, unknown> = {}
    if (title) updateData.title = title
    if (type) updateData.type = type
    if (targetRole) updateData.targetRole = targetRole
    if (company) updateData.company = company
    if (notes) updateData.notes = notes
    if (status) updateData.status = status
    if (rating !== undefined) updateData.rating = rating
    if (fileName) updateData.fileName = fileName

    updateData.lastModified = new Date().toISOString().split("T")[0]

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    if (!result.value) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Error updating resume:", error)
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB()
    const collection = db.collection(COLLECTION_NAME)

    const result = await collection.deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Resume deleted successfully" })
  } catch (error) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 })
  }
}
