import mongooose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongooose.connect(
      'MONGO_URI'
    );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
}
