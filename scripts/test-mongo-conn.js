require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set. Create a .env file with MONGO_URI.');
  process.exit(2);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
});

(async () => {
  try {
    await client.connect();
    const res = await client.db().command({ ping: 1 });
    console.log('MongoDB connection OK:', res);
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection FAILED:', err.message || err);
    process.exit(1);
  }
})();