const mongoose = require("mongoose");
const express = require("express");
const app = express();

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })

const URI = process.env.URI;
const PORT = process.env.PORT || 3000;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(
        `Database connection successful. Use our API on port: ${PORT}`
      );
    });
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
