import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuid4 } from 'uuid';

import Book from "../Models/bookModel.js";
import appError from "../Utils/appError.js";
import APIFeatures from "../Utils/apiFeatures.js";
import { uploadImage } from "../Middleware/uploadImageMiddleware.js";

export const uploadBookImage = uploadImage('cover');

export const resizeBookImage = asyncHandler(async (req, res, next) => {
    const fileName = `book-${uuid4()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/books/${fileName}`);

        req.body.cover = fileName;
    }
    next();
});

export const getBooks = asyncHandler(async (req, res, next) => {
    const feature = new APIFeatures(Book.find({ isAvailable: true }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const books = await feature.query;
    
    res.status(200).json({ status: 'success', result: books.length , books });
});

export const getBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new appError('No book found with that ID', 404));
    }

    res.status(200).json({ status: 'success', book });
});

export const createBook = asyncHandler(async (req, res, next) => {
    const book = await Book.create(req.body);

    res.status(201).json({ status: 'success', book });
});

export const updateBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, });

    if (!book) {
        return next(new appError('No book found with that ID', 404));
    }

    res.status(200).json({ status: 'success', book });
});

export const deleteBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
        return next(new appError('No book found with that ID', 404));
    }

    res.status(204).json({ status: 'success', book: null });
});