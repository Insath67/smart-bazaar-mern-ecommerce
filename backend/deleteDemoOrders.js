const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DB_URI ||
  process.env.DATABASE_URL ||
  process.env.CONNECTION_STRING;

if (!mongoUrl) {
  console.log("❌ MongoDB URL not found in .env");
  process.exit(1);
}

async function deleteDemoOrders() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected");

    const query = {
      $or: [
        { "address.country": /india/i },
        { "address.state": /uttar pradesh/i },
        { "address.city": /indrapuram/i },
        { "address.street": /main 11th/i },
      ],
    };

    const matchedOrders = await mongoose.connection.db
      .collection("orders")
      .find(query)
      .toArray();

    console.log(`Found ${matchedOrders.length} demo order(s):`);

    matchedOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order._id} | Total: ${order.total} | Status: ${order.status}`);
    });

    if (matchedOrders.length === 0) {
      console.log("No matching demo orders found.");
      await mongoose.disconnect();
      process.exit(0);
    }

    const result = await mongoose.connection.db
      .collection("orders")
      .deleteMany(query);

    console.log(`✅ Deleted ${result.deletedCount} demo order(s).`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

deleteDemoOrders();