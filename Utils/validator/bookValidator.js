import slugify from 'slugify';
import { check } from 'express-validator';

import validatorMiddleware from '../../Middleware/validatorMiddleware.js';

export const getBooksValidator = [
    check('id').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware,
];

export const createBookValidator = [
    check('name').notEmpty().withMessage('Please provide a name').custom((val, {req}) => {
        req.body.slug = slugify(val, { lower: true, });
        return true;
    }),
    check('author').notEmpty().withMessage('Please provide an author'),
    validatorMiddleware,
];

export const updateBookValidator = [
    check('id').isMongoId().withMessage('Invalid ID'),
    check('name').optional().custom((val, {req}) => {
        req.body.slug = slugify(val, { lower: true, });
        return true;
    }),
    validatorMiddleware,
];

export const deleteBookValidator = [
    check('id').isMongoId().withMessage('Invalid ID'),
    validatorMiddleware,
];