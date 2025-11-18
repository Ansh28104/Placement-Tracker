import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI="mongodb+srv://d23it158_db_user:Ansh-2810@placementprep.ledr09d.mongodb.net/placement-tracker?appName=Placementprep"
JWT_SECRET="devlopment"
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set")
}

async function initializeDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("[v0] Connected to MongoDB")

    const db = client.db("placement-tracker")

    // Create collections if they don't exist
    const collections = [
      "users",
      "coding-problems",
      "applications",
      "interviews",
      "goals",
      "resources",
      "aptitude-tests",
    ]

    for (const collectionName of collections) {
      const exists = await db.listCollections({ name: collectionName }).toArray()
      if (exists.length === 0) {
        await db.createCollection(collectionName)
        console.log(`[v0] Created collection: ${collectionName}`)
      } else {
        console.log(`[v0] Collection already exists: ${collectionName}`)
      }
    }

    // Create indexes for better query performance
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    console.log("[v0] Created unique index on users.email")

    const codingCollection = db.collection("coding-problems")
    await codingCollection.createIndex({ userId: 1 })
    console.log("[v0] Created index on coding-problems.userId")

    const applicationsCollection = db.collection("applications")
    await applicationsCollection.createIndex({ userId: 1 })
    console.log("[v0] Created index on applications.userId")

    const interviewsCollection = db.collection("interviews")
    await interviewsCollection.createIndex({ userId: 1 })
    console.log("[v0] Created index on interviews.userId")

    const goalsCollection = db.collection("goals")
    await goalsCollection.createIndex({ userId: 1 })
    console.log("[v0] Created index on goals.userId")

    // Test connection with ping
    await db.admin().ping()
    console.log("[v0] Successfully connected to MongoDB!")
    console.log("[v0] Database initialization completed.")

  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

initializeDatabase()
