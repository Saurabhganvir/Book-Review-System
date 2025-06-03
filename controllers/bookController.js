import Book from '../models/bookModel.js';
import Review from '../models/reviewModel.js';

//creating newbok
//post/book

const createBook =async(req, res, next)=>{
    try {
        const bookData = {
            ...req.body,
            createdBy: req.user.id
        };
        
        const book = await Book.create(bookData);
        await book.populate('createdBy', 'username name');

        res.status(201).json({
            success:true,
            message:'Book created successfully',
            data: book
        });

    } catch (error) {
        next(error);
    }
};


//get books with pagination and filters
const getBooks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        const skip= (page-1)*limit;

        //buildng filter object
        const filter = {};
        if(req.query.author){
            filter.author = {$regex: req.query.author, $options:'i'};
        }
        if (req.query.genre) {
            filter.genre = { $regex: req.query.genre, $options: 'i' };
        }
        //get books with pagination
        const books= await Book.find(filter)
        .populate('createdBy', 'username name')
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

        //total count for paginantion
        const total = await Book.countDocuments(filter);

        //calculate rating and review count
        const booksWithStats = await Promise.all(
            books.map(async(book)=>{
                const reviews = await Review.find({book:book._id});
                const averageRating = reviews.length > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                    : 0;

                return {
                    ...book.toObject(),
                    averageRating: parseFloat(averageRating.toFixed(1)),
                    reviewCount: reviews.length
                };
            })   
        );

            res.json({
                success: true,
                data: booksWithStats,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            });

    } catch (error) {
        next(error);
    }
};


//get single book with review
//get/books/:id

const getBookById = async(req, res, next)=>{
    try {
        const book = await Book.findById(req.params.id).populate('createdBy', "username name");

        if(!book){
            return res.status(404).json({
                success:false,
                message:'Book not found'
            });
        }

        //paginated reviews

        const reviewPage = parseInt(req.query.reviewPage)||1;
        const reviewLimit= parseInt(req.query.reviewLimit)||5;
        const reviewSkip = (reviewPage-1)*reviewLimit;

        const reviews = await Review.find({book:book._id})
            .populate('user', 'username name')
            .sort({createdAt:-1})
            .skip(reviewSkip)
            .limit(reviewLimit);

        const totalReviews = await Review.countDocuments({book:book._id});

        //calculating average rating
        const allReviews = await Review.find({book: book._id});
        const averageRating = allReviews.length > 0 
            ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
            : 0;

        res.json({
            success:true,
            data:{
                ...book.toObject(),
                averageRating: parseFloat(averageRating.toFixed(1)),
                reviewCount: allReviews.length,
                reviews,
                reviewPagination:{
                    page:reviewPage,
                    limit: reviewLimit,
                    total: totalReviews,
                    totalPages  : Math.ceil(totalReviews/reviewLimit),
                    hasNext: reviewPage < Math.ceil(totalReviews/reviewLimit),
                    hasPrev: reviewPage>1
                }
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {createBook, getBooks, getBookById}