import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

//generating jwt token
const generateToken = (userId)=>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET || 'fallback_secret',
        {expiresIn: '24h'}
    );
};

// register new user
// post/auth/signup

const signup = async(req, res, next)=>{
    try {
        const {username , email, password, name} = req.body;

        //checking existing user
        const existingUser = await User.findOne({
            $or:[{email}, {username}]
        });

        if(existingUser){
            return res.status(409).json({
                success:false,
                message: 'Username or email already exists'
            });
        }

        //creating new user
        const user = await User.create({
            username,
            email,
            password,
            name
        });

        //generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success:true,
            message: 'User registered successfully',
            data:{
                user, token
            }
        });

    } catch (error) {
        next(error);
    }
};


//Login user
//post/auth/login

const login = async(req, res, next)=>{
    try {
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({
                success:false,
                message:'Username and password are required'
            });
        }

        //find user by username or email
        const user = await User.findOne({
            $or:[{username}, {email:username}]
        }).select('+password');


        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        //generate token
        const token = generateToken(user._id);

        res.json({
            success:true,
            message:'Login Successful',
            data:{
                user:{
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });


    } catch (error) {
        next(error);
    }
};

module.exports= {signup, login};