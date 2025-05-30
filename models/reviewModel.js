import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type: Number,
        required: [true, 'Rating is required'],
        min:[1, 'reating must be at leat 1'],
        max:[5, 'rating cannot exceed 5']
    },
    title:{
        type:String,
        required:[true, 'Review title is required'],
        trim: true,
        maxlength: [255, 'Review title cannot exceed 255 cahracters']
    },
    content:{
        type: String,
        required: [true, 'Review content is required'],
        trim:true,
        maxlength:[2000, 'Review content cannot exceed 2000 characters']
    }
})

//ensuring 1 review per user per book
reviewSchema.index({book:1, user:1}, {unique:true});

module.exports = mongoose.model('Review', reviewSchema);