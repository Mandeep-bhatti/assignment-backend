import mongoose from 'mongoose';

export const connect_mongodb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connection established on ${conn.connection.host}`);
  } catch (error) {
    console.error('connection failed', error.message);
    process.exit(1); 
  }
};

