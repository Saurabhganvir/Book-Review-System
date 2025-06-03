const errorHandler = (err, req, res, next)=>{
    let error = {...err};
    error.message = err.message;

    console.log(error);

    //Mongoose bad ObjectId
    if(err.name === 'CastError'){
        const message = 'Resourse not found';
        error = {message, statusCode:404};
    }

    //mongoose duplicate key
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        error = {message, statusCode:400};
    }

    // mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val=>val.message).join(', ');
        error = {message, statusCode:400};
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message|| 'Server Error'
    });
};

export default errorHandler;