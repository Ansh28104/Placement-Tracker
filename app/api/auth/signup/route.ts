import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hash } from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("placement-tracker")
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      points: 100,
      level: 1,
      streak: 0,
      joinDate: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    })

    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        points: 100,
        level: 1,
        streak: 0,
        joinDate: new Date().toISOString().split("T")[0],
      },
      token,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
