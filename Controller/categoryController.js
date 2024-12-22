import asyncHandler from 'express-async-handler';
import appError from '../Utils/appError.js';

import Category from '../Models/categoryModel.js';


export const createCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.create(req.body);

    res.status(201).json({ status: 'success', category });
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find({});

    res.status(200).json({ status: 'success', results: categories.length, categories });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new appError('No category found with that ID', 404));
    }

    res.status(204).json({ status: 'success', data: null });
});