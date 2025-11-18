
// Cast to NodeJS.Process to access env safely
declare const process: NodeJS.Process

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI

if (!mongoUri) {
  throw new Error("Invalid/missing environment variable: MONGO_URI or MONGODB_URI")
}

const uri = mongoUri
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
