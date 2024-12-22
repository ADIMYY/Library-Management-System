import express from 'express';

import { 
    uploadBookImage, 
    resizeBookImage, 
    getBooks, 
    getBook, 
    createBook, 
    updateBook,
    deleteBook
} from '../Controller/bookController.js';

import {
    getBooksValidator,
    createBookValidator,
    updateBookValidator,
    deleteBookValidator
} from '../Utils/validator/bookValidator.js';

import { protect, restrictTo } from '../Controller/authController.js';

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getBooks)
    .post(
        restrictTo('admin'), 
        uploadBookImage, 
        resizeBookImage, 
        createBookValidator,
        createBook
    );

router
    .route('/:id')
    .get(getBooksValidator, getBook)
    .put(restrictTo('admin'), updateBookValidator , updateBook)
    .delete(restrictTo('admin'), deleteBookValidator , deleteBook);

export default router;