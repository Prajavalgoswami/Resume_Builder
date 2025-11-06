import mongooose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongooose.connect(
      'mongodb+srv://prajaval03:NhdxoPZdrfdGy8iV@cluster0.hvpghay.mongodb.net/ResumeBuilder?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
}