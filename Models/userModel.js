import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!'],
        },
        slug: String,
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
        },
        hashedCode: String,
        hashedCodeExpires: Date,
        hashedCodeVerified: Boolean,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        passwordChangeAt: Date,
        borrowedBooks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }],
        reservations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }],
        borrowedBooks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }],
    },
    { timestamps: true },
);

userSchema.pre(/^save/, async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;