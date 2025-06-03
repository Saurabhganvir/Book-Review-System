import mongoose from 'mongoose';

const connectDB = async()=>{
    try {
        const connection  = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(
            `Database connected : ${connection.connection.host}, ${connection.connection.name}`
        );
    } catch (error) {
        console.log(`error while connecting to database: ${error}`);
        process.exit(1);
    }
}

export default connectDB;