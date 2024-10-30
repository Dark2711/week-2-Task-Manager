import mongoose from 'mongoose';
import 'dotenv/config';
const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URL || '')
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.log('ERROR:Connecting to Database', err);
    });
};
export default connectDB;
