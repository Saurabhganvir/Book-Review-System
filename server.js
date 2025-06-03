import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//database connecting
import connectDB from './config/db.js';
dotenv.config();

//importing routes
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
//importing middlewares
import errorHandler from './middlewares/errorHandler.js ';

const app = express();


//middlewares
app.use(express.json());
app.use(cors());


//routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

//search routes
app.use('/search', searchRoutes);

//error handling
app.use(errorHandler);

//404 handler
app.use((req, res)=>{
    res.status(404).json({
        success:false,
        message: 'Endpoint not found'
    });
});

const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Book review system is running on port ${PORT}`);
        console.log(`\nAuthentication Endpoints:`);
        console.log(`  POST   /auth/signup - Register a new user`);
        console.log(`  POST   /auth/login - Authenticate and get token`);
        console.log(`\nBook Endpoints:`);
        console.log(`  POST   /books - Add a new book (Auth required)`);
        console.log(`  GET    /books - Get all books (with pagination and filters)`);
        console.log(`  GET    /books/:id - Get book details with reviews`);
        console.log(`\nReview Endpoints:`);
        console.log(`  POST   /books/:id/reviews - Submit a review (Auth required)`);
        console.log(`  PUT    /reviews/:id - Update your review (Auth required)`);
        console.log(`  DELETE /reviews/:id - Delete your review (Auth required)`);
        console.log(`\nSearch Endpoints:`);
        console.log(`  GET    /search - Search books by title or author`);
    })
});
