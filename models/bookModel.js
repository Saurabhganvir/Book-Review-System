import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, 'Title is required'],
        trim:true,
        maxlength: [255, 'Title cannot exceed 255 characters']
    },
    auther:{
        type: String,
        required: [true, 'Author is required'],
        trim:true,
        maxlength: [255, 'Author name cannot exceed 255 characters']
    },
    isbn:{//international standard book number
        type: String,
        unique: true,
        sparse:true,//null but unique values are allowed
        trim: true,
        maxlength: [20, 'ISBN cannot exceed 20 characters']
    },
    publishedYear:{
        type: Number,
        min:[1400, 'Published year must be valid year'],
        max:[new Date().getFullYear(), 'Publishe year cannot be in the future']
    },
    genre:{
        type: String,
        trim: true,
        maxlength:[100, 'Genre cannot exceed 100 characters']
    },
    description:{
        type:String,
        trim:true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    createBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps:true});


//index for search functions
bookSchema.index({title:'text', author:'text'});
bookSchema.index({author: 1});
bookSchema.index({genre: 1});

module.exports = mongoose.model('Book', bookSchema);