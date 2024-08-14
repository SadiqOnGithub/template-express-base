import mongoose from 'mongoose';


const dbConnect = async () => {
  const connectionString = process.env.DB_STRING;
  console.log('Connected to MongoDB');
  try {
    const name = await mongoose.connect(connectionString);
  } catch (error) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default dbConnect;