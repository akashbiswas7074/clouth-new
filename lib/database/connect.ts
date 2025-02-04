import mongoose from 'mongoose';
const MONGODBURI = process.env.MONGODB_URL!;

const connectToDatabase = async () => {
    try {
        const connectionString = MONGODBURI;
        const connection = await mongoose.connect(connectionString);
        // console.log(connection);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1);
    }
};

export default connectToDatabase;