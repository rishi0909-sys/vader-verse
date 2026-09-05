const crypto = require("crypto");

const generateSecret = () => {
  // Generates a 32-byte (256-bit) cryptographically strong random hex string
  const secret = crypto.randomBytes(32).toString("hex");
  console.log("\n🔑 Here is your generated NEXTAUTH_SECRET:\n");
  console.log(`NEXTAUTH_SECRET="${secret}"\n`);
  console.log("Copy and paste this into your .env file!\n");
};

generateSecret();
