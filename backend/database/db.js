require("dotenv").config();
const mongoose = require("mongoose");

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

exports.connectToDB = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    }

    cached.conn = await cached.promise;
    console.log("connected to DB");

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log("MongoDB connection error:", error.message);
    throw error;
  }
};