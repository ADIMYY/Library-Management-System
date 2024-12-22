import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name']
        },
        slug: String,
        author: {
            type: String,
            required: [true, 'Please provide an author']
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Please provide a category']
        },
        reservations: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            reservedAt: { type: Date, default: Date.now() }
        }],
        borrowHistory: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            borrowedAt: { type: Date, default: Date.now() },
            returnedAt: Date,
        }],
    }, { timestamps: true }
);

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;