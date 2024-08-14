import dotenv from "dotenv";

import app from "./app.js";
import dbConnect from "#db";
import { errorHandler } from "#errors/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 8080;


// catching error that is thrown in the synchronous part of your application and it's not caught or handled anywhere in the call stack.
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


dbConnect()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

    process.on('unhandledRejection', err => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  });


app.use(errorHandler);