import asyncHandler from 'express-async-handler';

import appError from '../Utils/appError.js';
import User from '../Models/userModel.js';
import Book from '../Models/bookModel.js';

// Borrowing a book
export const borrowBook = asyncHandler(async (req, res, next) => {
    const { bookId } = req.params;

    const user = await User.findById(req.user._id);
    const book = await Book.findById(bookId);

    if (!book) {
        return next(new appError('Book not found', 404));
    }

    if (!book.isAvailable) {
        return res.status(400).json({ status: 'fail', message: 'Book is already borrowed' });
    }

    book.isAvailable = false;
    user.borrowedBooks.push(book._id);

    await book.save();
    await user.save();

    res.status(200).json({ status: 'success', message: 'Book borrowed successfully' });
});

// Returning a book
export const returnBook = asyncHandler(async (req, res, next) => {
    const { bookId } = req.params;

    const user = await User.findById(req.user._id);
    const book = await Book.findById(bookId);

    if (!book) {
        return next(new appError('Book not found', 404));
    }

    const index = user.borrowedBooks.indexOf(book._id);
    if (index === -1) {
        return next(new appError('Book not borrowed', 400));
    }

    book.isAvailable = true;
    user.borrowedBooks.splice(index, 1);

    await book.save();
    await user.save();

    res.status(200).json({ status: 'success', message: 'Book returned successfully' });
});

// Get all borrowed books by a user
export const getBorrowedBooks = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('borrowedBooks');

    res.status(200).json({ status: 'success', data: user.borrowedBooks });
});