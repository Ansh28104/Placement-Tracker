import { connectDB } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

const COLLECTION_NAME = "resumes"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const db = await connectDB()
    const collection = db.collection(COLLECTION_NAME)

    if (userId) {
      const resumes = await collection
        .find({ userId })
        .sort({ lastModified: -1 })
        .toArray()
      return NextResponse.json(resumes)
    }

    const resumes = await collection.find({}).sort({ lastModified: -1 }).toArray()
    return NextResponse.json(resumes)
  } catch (error) {
    console.error("Error fetching resumes:", error)
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, type, targetRole, company, notes, fileName, userId } = body

    if (!title || !type || !targetRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectDB()
    const collection = db.collection(COLLECTION_NAME)

    const newResume = {
      title,
      type,
      targetRole,
      company: company || null,
      notes,
      fileName,
      userId: userId || "default",
      version: "v1.0",
      status: "draft",
      lastModified: new Date().toISOString().split("T")[0],
      feedback: [],
      rating: 0,
      downloadCount: 0,
      fileSize: "0 KB",
      atsScore: 85,
      atsAnalysis: generateATSAnalysis(notes),
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newResume)

    return NextResponse.json(
      {
        ...newResume,
        _id: result.insertedId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating resume:", error)
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 })
  }
}

function generateATSAnalysis(notes: string) {
  const issues = []
  const suggestions = []
  const keywords = []
  let score = 100

  if (!notes) {
    issues.push({ type: "error", message: "Missing contact information section" })
    score -= 15
  }

  const hasMetrics = /\b\d+%|\$\d+|\d+x|improved|increased|decreased|reduced/i.test(notes)
  if (!hasMetrics) {
    suggestions.push("Add quantifiable metrics and achievements (e.g., 'Improved performance by 40%')")
    score -= 10
  } else {
    keywords.push("metrics")
  }

  const standardSections = ["experience", "education", "skills", "projects"]
  const hasSections = standardSections.some((section) => notes.toLowerCase().includes(section))
  if (!hasSections) {
    suggestions.push("Ensure resume includes standard sections: Experience, Education, Skills, Projects")
    score -= 10
  } else {
    keywords.push("standard_sections")
  }

  const techKeywords = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "nodejs",
    "sql",
    "api",
    "aws",
    "git",
    "agile",
  ]
  const foundTechKeywords = techKeywords.filter((keyword) => notes.toLowerCase().includes(keyword))
  if (foundTechKeywords.length > 0) {
    keywords.push(...foundTechKeywords)
  }

  const actionVerbs = [
    "developed",
    "implemented",
    "designed",
    "led",
    "managed",
    "optimized",
    "engineered",
    "created",
    "built",
  ]
  const hasActionVerbs = actionVerbs.some((verb) => notes.toLowerCase().includes(verb))
  if (!hasActionVerbs) {
    suggestions.push("Use strong action verbs at the beginning of bullet points")
    score -= 5
  }

  score = Math.max(0, Math.min(100, score))

  return {
    score,
    issues,
    suggestions,
    keywords: [...new Set(keywords)],
    formatting: {
      hasSimpleFormatting: true,
      hasStandardSections: hasSections,
      hasContactInfo: !!notes,
      hasMetrics: hasMetrics,
    },
  }
}
