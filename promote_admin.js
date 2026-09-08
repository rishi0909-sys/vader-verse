const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
const User = require("./models/User").default || require("./models/User");

async function promoteAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { email: "rishabhmudgal604@gmail.com" },
      { $set: { role: "admin" } },
      { new: true }
    );
    if (user) {
      console.log("Successfully promoted user to admin:", user.username);
    } else {
      console.log("User not found!");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

promoteAdmin();
