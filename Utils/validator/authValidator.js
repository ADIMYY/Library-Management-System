import slugify from 'slugify';
import { body } from 'express-validator';

import validatorMiddleware from '../../Middleware/validatorMiddleware.js';
import User from '../../Models/userModel.js';

export const signupValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .custom((val, {req}) => {
            req.body.slug = slugify(val, {lower: true});
            return true;
        }),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is invalid')
        .custom(async (val) => {
            const user = await User.findOne({email: val });
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters long'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm Password is required')
        .isLength({min: 8})
        .withMessage('Confirm Password must be at least 8 characters long')
        .custom((val, {req}) => {
            if (val !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    validatorMiddleware,
];

export const loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is invalid'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters long'),
    validatorMiddleware,
];

export const forgotPasswordValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is invalid'),
    validatorMiddleware,
];

export const resetPasswordValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is invalid'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters long'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm Password is required')
        .isLength({min: 8})
        .withMessage('Confirm Password must be at least 8 characters long')
        .custom((val, {req}) => {
            if (val !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    validatorMiddleware,
];