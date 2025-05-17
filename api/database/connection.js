const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

async function connection() {
  try {
    await mongoose.connect(uri);
    console.log("successfully connected to MongoDB");
  } catch (error) {
    console.log("error connecting to MongoDB database");
    console.log(error);
    process.exit();
    await mongoose.disconnect();
  }
}

module.exports = connection;
