import express from 'express';

import { 
    borrowBook, 
    returnBook, 
    getBorrowedBooks 
} from '../Controller/borrowingController.js';

import { 
    borrowBookValidator, 
    returnBookValidator 
} from '../Utils/validator/borrowingValidator.js';

import { protect } from '../Controller/authController.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getBorrowedBooks);
router.route('/borrow/:bookId').post(borrowBookValidator, borrowBook)
router.route('/return/:bookId').post(returnBookValidator, returnBook);

export default router;