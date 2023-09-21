const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MOONGODB_URI;

async function connection() {
  try {
    await mongoose.connect(uri);
    console.log("successfully connected to MongoDB");
  } catch {
    console.log("error connecting to MongoDB database");
    process.exit();
  }
}

module.exports = connection;
