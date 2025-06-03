import Book from '../models/bookModel.js';
import Review from '../models/reviewModel.js';

// search by title / author
// get/search

export const searchBooks = async(req, res, next)=>{
    try {
        const {q: query}= req.query;
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        const skip = (page-1)*limit;

        if(!query || query.trim()==''){
            return res.status(400).json({
                success:false,
                message:'Search query is required'
            });
        }

        //searching using text or regex
        const searchFilter = {
            $or:[
                {title:{$regex:query, $options:'i'}},
                {author:{$regex:query, $options:'i'}}
            ]
        };

        const books = await Book.find(searchFilter)
            .populate('createdBy', 'username name')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit);
        
        const total = await Book.countDocuments(searchFilter);

        //Add review stats
        const booksWithStats = await Promise.all(
            books.map(async(book)=>{
                const reviews = await Review.find({book:book._id});
                const averageRating = reviews.length > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                    : 0;
                return {
                    ...book.toObject(),
                    averageRating:parseInt(averageRating.toFixed(1)),
                    reviewCount: reviews.length
                };
            })
        );

        res.json({
            success: true,
            data: booksWithStats,
            query: query.trim(),
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
