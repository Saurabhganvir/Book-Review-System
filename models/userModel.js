import mongoose from 'mongoose';
import bcryt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique:true,
        trim: true,
        minlenght: [3, 'Username must be at least 3 characters long'],
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email:{
        type: String,
        required: [true, 'Email i required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password:{
        type:String,
        required: [true, 'password is required'],
        minlenght:[6, 'password must be at least 6 characters long']
    }
}, {timestamps:true});

//hashing password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcryt.genSalt(10);
        this.password = await bcryt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

//comapare passwords
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryt.compare(candidatePassword, this.password);
};

//remove password from json output
userSchema.methods.toJSON= function(){
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);