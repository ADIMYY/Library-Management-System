import crypto from 'crypto';

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../Models/userModel.js';
import appError from '../Utils/appError.js';
import generateToken from '../Utils/generateToken.js';
import sendEmail from '../Utils/sendEmail.js';

export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password,});

    const token = generateToken(user._id);

    res.status(201).json({ status: 'success', user, token });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new appError('Incorrect email or password', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({ status: 'success', user, token });
});

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new appError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new appError('The user belonging to this token does no longer exist.', 401));
    }

    if (currentUser.passwordChangeAt) {
        const changedPasswordAfter = new Date(decoded.iat * 1000) > currentUser.passwordChangeAt;
        if (changedPasswordAfter) {
            return next(new appError('User recently changed password! Please log in again.', 401));
        }
    }

    req.user = currentUser;
    next();
});

export const restrictTo = (...roles) => {
    return asyncHandler((req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    });
};

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new appError('There is no user with email address.', 404));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    user.hashedCode = hashedCode;
    user.hashedCodeExpires = Date.now() + 10 * 60 * 1000;
    user.hashedCodeVerified = false;

    await user.save();

    const message = `Your verification code is ${code}. Please submit this code within 10 minutes.`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            text: message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (error) {
        user.hashedCode = undefined;
        user.hashedCodeExpires = undefined;
        user.hashedCodeVerified = undefined;

        await user.save();

        console.log(error.message);
        return next(new appError('There was an error sending the email. Try again later!', 500));
    }
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedCode = crypto.createHash('sha256').update(req.body.code).digest('hex');

    const user = await User.findOne({
        hashedCode,
        hashedCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new appError('Reset Code is invalid or has expired', 400));
    }

    user.hashedCodeVerified = true;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Code verified successfully!', });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new appError('There is no user with email address.', 404));
    }

    if (!user.hashedCodeVerified) {
        return next(new appError('Please verify your code first.', 400));
    }

    user.password = password;
    user.hashedCode = undefined;
    user.hashedCodeExpires = undefined;
    user.hashedCodeVerified = undefined;

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({ status: 'success', token });
});