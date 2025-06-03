import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticationToken = async(req, res, next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];//Bearer token

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user= await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                success:false,
                message:'Invalid token - user not found'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(403).json({
            success:false,
            message:'Invalid or expired token'
        });
    }
};

export default authenticationToken;