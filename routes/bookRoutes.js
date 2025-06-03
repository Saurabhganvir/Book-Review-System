import express from 'express';
import {createBook, getBooks, getBookById} from '../controllers/bookController.js'
import authenticationToken from '../middlewares/auth.js';
import {createReview} from '../controllers/reviewController.js';

const router= express.Router();

router.route('/').post(authenticationToken, createBook).get(getBooks);

router.get('/:id',getBookById);
router.post('/:id/reviews', authenticationToken, createReview);

export default router;