import express from 'express';
import {searchBooks } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', searchBooks);

module.exports = router;