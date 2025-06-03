import express from 'express';
import {updateReview, deleteReview}  from '../controllers/reviewController.js';
import authenticationToken from '../middlewares/auth.js';


const router = express.Router();

router.route('/:id')
    .put(authenticationToken, updateReview)
    .delete(authenticationToken, deleteReview);


module.exports = router;