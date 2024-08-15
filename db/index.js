import mongoose from 'mongoose';


const dbConnect = async () => {
  const connectionString = process.env.DB_STRING;
  try {
    const name = await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default dbConnect;