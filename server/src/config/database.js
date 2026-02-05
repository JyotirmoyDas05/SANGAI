import mongoose from 'mongoose';
import dns from 'dns';

// Use Google DNS to bypass ISP blocking of MongoDB SRV records
dns.setServers(['1.1.1.1', '1.0.0.1']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
