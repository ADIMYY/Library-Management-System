import asyncHandler from 'express-async-handler';

import appError from '../Utils/appError.js';
import Book from '../Models/bookModel.js';
import Log from '../Models/logModel.js';

// Report: currently borrowed books
export const currentlyBorrowedBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find({ isAvailable: false }).populate('borrowHistory.user', 'name');

    const report = books.map(book => ({
        name: book.name,
        author: book.author,
        borrowedBy: book.borrowHistory.filter(h => !h.returnedAt).map(h => ({
            userId: h.user._id,
            name: h.user.name,
            borrowedAt: h.borrowedAt
        }))
    }));

    res.status(200).json({ status: 'success', report });
});

// Report: overdue books
export const overdueBooks = asyncHandler(async (req, res, next) => {
    const overdueDaysLimit = 14;
    const currentDate = new Date();

    const books = await Book.find({ isAvailable: false }).populate('borrowHistory.user', 'name');

    const report = books.map(book => ({
        name: book.name,
        author: book.author,
        overdueBy: book.borrowHistory.filter(h => {
            if (!h.returnedAt) {
                const borrowedDuration = (currentDate - h.borrowedAt) / (1000 * 60 * 60 * 24);
                return borrowedDuration > overdueDaysLimit;
            }
            return false;
        }).map(h => ({
            userId: h.user._id,
            userName: h.user.name,
            borrowedAt: h.borrowedAt,
            overdueDay: Math.ceil((currentDate - h.borrowedAt) / (1000 * 60 * 60 * 24) - overdueDaysLimit)
        }))
    })).filter(book => book.overdueBy.length > 0);

    res.status(200).json({ status: 'success', report });
});

// System activity logs
export const systemActivityLogs = asyncHandler(async (req, res, next) => {
    const logs = await Log.find().sort({ performedAt: -1 });

    res.status(200).json({ status: 'success', logs });
});

// log an action
export const logAction = asyncHandler(async (req, res, next) => {
    const { action, details } = req.body;
    const log = await Log.create({ action, details });

    if (!action || !details) {
        return next(new appError('Please provide action and details', 400));
    }

    res.status(201).json({ status: 'success', log });
});