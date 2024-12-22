import asyncHandler from "express-async-handler";

import appError from "../Utils/appError.js";
import User from "../Models/userModel.js";
import Book from "../Models/bookModel.js";

export const reserveBook = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const book = await Book.findById(req.params.bookId);

    if (!book) {
        return next(new appError('Book not found', 404));
    }

    const index = book.reservations.findIndex(
        reservation => reservation.user.toString() === req.user._id
    );
    if (index !== -1) {
        return res.status(400).json({ status: 'fail', message: 'You have already reserved this book' });
    }

    book.reservations.push({ user: req.user._id });
    user.reservations.push(book._id);

    await book.save();
    await user.save();

    res.status(200).json({ status: 'success', message: 'Book reserved successfully' });
});

// get all active reservations
export const getReservations = asyncHandler(async (req, res, next) => {
    const books = await Book.find({ 'reservations.0': { $exists: true } }).populate('reservations.user', 'name');

    const reservations = books.map(book => ({
        bookName: book.name,
        reservedBy: book.reservations.map(reservation => reservation.user.name)
    }));

    res.status(200).json({ status: 'success', reservations });
});

// get all reservations by a user
export const getUserReservations = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('reservations', 'name author');

    res.status(200).json({ status: 'success', reservations: user.reservations });
});

// cancel a reservation
export const cancelReservation = asyncHandler(async (req, res, next) => {
    const {  bookId } = req.params;
    const user = await User.findById(req.user._id);
    const book = await Book.findById(bookId);

    if (!book) {
        return next(new appError('Book not found', 404));
    }

    user.reservations = user.reservations.filter(reservation => reservation.toString() !== bookId);
    book.reservations = book.reservations.filter(reservation => reservation.user.toString() !== req.user._id);

    await user.save();
    await book.save();

    res.status(200).json({ status: 'success', message: 'Reservation canceled successfully' });
});