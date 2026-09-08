const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const User = require("./models/User").default || require("./models/User");

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // 1. Create a normal user
  const normalUser = await User.create({
    username: "testuser_normal_" + Date.now(),
    email: "normal@test.com" + Date.now(),
    role: "user"
  });

  // 2. Create an admin user
  const adminUser = await User.create({
    username: "testuser_admin_" + Date.now(),
    email: "admin@test.com" + Date.now(),
    role: "admin"
  });

  const secret = process.env.JWT_SECRET;
  
  // Create normal token
  const normalToken = jwt.sign({ userId: normalUser._id, role: normalUser.role }, secret);
  // Create admin token
  const adminToken = jwt.sign({ userId: adminUser._id, role: adminUser.role }, secret);

  // --- TESTS ---

  console.log("TEST 1: Normal User calling Admin API...");
  const res1 = await fetch("http://localhost:3000/api/admin/tournaments", {
    headers: { Authorization: `Bearer ${normalToken}` }
  });
  console.log("Status:", res1.status); // Expected: 403

  console.log("\nTEST 2: Admin User calling Admin API...");
  const res2 = await fetch("http://localhost:3000/api/admin/tournaments", {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log("Status:", res2.status); // Expected: 200

  // Privilege escalation: Normal user crafts a fake token saying they are admin
  console.log("\nTEST 3: Privilege Escalation (Fake payload role)");
  // But wait, they can't sign it! We simulate them somehow getting their token to say role: admin
  // (which is impossible without the secret, but let's say the secret was leaked or the backend trusted the payload blindly without checking DB)
  // Our backend explicitly checks the DB user.role, so even IF the token payload says "admin", if the DB says "user", it fails.
  const forgedToken = jwt.sign({ userId: normalUser._id, role: "admin" }, secret);
  const res3 = await fetch("http://localhost:3000/api/admin/tournaments", {
    headers: { Authorization: `Bearer ${forgedToken}` }
  });
  console.log("Status:", res3.status); // Expected: 403

  console.log("\nTEST 4: Submitting a report");
  const res4 = await fetch("http://localhost:3000/api/reports", {
    method: "POST",
    headers: { Authorization: `Bearer ${normalToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: "Spam",
      description: "User is spamming the chat.",
      // Try to escalate privilege by passing a different reporter
      reporter: adminUser._id
    })
  });
  const data4 = await res4.json();
  console.log("Report created for reporter:", data4.data?.reporter);
  console.log("Should match normalUser._id:", normalUser._id.toString() === data4.data?.reporter);

  process.exit(0);
}

test().catch(console.error);
