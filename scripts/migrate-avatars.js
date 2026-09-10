require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const User = require("./models/User").default || require("./models/User");

async function migrate() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to DB...");
    await mongoose.connect(uri);

    console.log("Running migration pipeline...");
    
    // Aggregation pipeline update: Set avatar to empty string if it doesn't exist
    const result = await User.updateMany(
      { avatar: { $exists: false } },
      [{ $set: { avatar: "" } }]
    );

    console.log(`Migration complete. Modified ${result.modifiedCount} documents.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrate();
