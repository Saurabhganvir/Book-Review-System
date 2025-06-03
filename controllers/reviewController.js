import Review from '../models/reviewModel.js';
import Book from '../models/bookModel.js';

//create a review for a book
//post/books/:id/reviews

export const createReview = async (req, res, next)=>{
    try {
        const bookId  = req.params.id;

        //check if book exists
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({
                success:false,
                message:'Book not found'
            });
        }

        //check if user already reviewed
        const existingReview = await Review.findOne({
            book:bookId,
            user: req.user.id
        });

        if(existingReview){
            return res.status(409).json({
                success:false,
                message:'You have already reviewed this book'
            });
        }
        
        const review = await Review.create({
            ...req.body,
            book:bookId,
            user: req.user.id
        });

        await review.populate('user', 'username name');

        res.status(201).json({
            success:true,
            message: 'Review created successfully',
            data: review
        });

    } catch (error) {
        next(error);
    }
};

//updating review
//put/reviews/:id

export const updateReview = async(req, res, next)=>{
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if(!review){
            return res.status(404).json({
                success:false,
                message:"Review not found or not authorised",
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id, req.body, {new:true, runValidators: true}
        ).populate('user', 'username name');

        res.json({
            success:true,
            message:" Review updated successfully",
            data: updatedReview
        });

    } catch (error) {
        next(error);
    }
};


// deleting a review
//delete/reviews/:id

export const deleteReview = async(req, res, next)=>{
    try {
        const review = await Review.findOne({
            _id:req.params.id,
            user:req.user.id
        });

        if(!review){
            return res.status(404).json({
                success:false,
                message:'Review not found or not authorised'
            });
        }

        await review.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};
