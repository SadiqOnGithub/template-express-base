import mongoose from 'mongoose';


const dbConnect = async () => {
  const connectionString = process.env.DB_STRING;
  try {
    const name = await mongoose.connect(connectionString);
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;