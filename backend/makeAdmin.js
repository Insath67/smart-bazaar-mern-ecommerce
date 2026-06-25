const mongoose = require("mongoose");
require("dotenv").config();

const email = "insathmansoorofficial@gmail.com";

const mongoUrl =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DB_URI ||
  process.env.DATABASE_URL ||
  process.env.CONNECTION_STRING;

if (!mongoUrl) {
  console.log("❌ MongoDB URL not found in .env");
  console.log("Check your .env variable name.");
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected");

    const result = await mongoose.connection.db.collection("users").updateOne(
      { email: email },
      {
        $set: {
          isAdmin: true,
          isVerified: true,
        },
      }
    );

    if (result.matchedCount === 0) {
      console.log("❌ User not found:", email);
    } else {
      console.log("✅ User updated as admin:", email);
    }

    const user = await mongoose.connection.db.collection("users").findOne(
      { email: email },
      { projection: { password: 0 } }
    );

    console.log(user);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();