import dotenv from "dotenv";
import mongoose from 'mongoose';

import app from "./app.js";
import dbConnect from "#db";

dotenv.config();

const PORT = process.env.PORT || 8080;

dbConnect();


// Error handling middleware should have a response sent or passed to next error handler
// app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB`);
  // serve listening only after the mongoDB is connected
  app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
});

mongoose.connection.on('error', err => {
  console.error(err);
  // log the error
});
