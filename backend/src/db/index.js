import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
    try {
       const connection = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
        console.log('MongoDB connected successfully' + connection.connection.host);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

export default connectDB;