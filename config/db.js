// config/db.js - MongoDB Connection Configuration using Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://shivanshrajput3009_db_user:1zZTzibQiuLJgg1j@cluster0.u1lkuak.mongodb.net/skillloop?retryWrites=true&w=majority';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
