import multer from "multer";

import appError from "../Utils/appError.js";

const multerOptions = () => {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new appError('Not an image! Please upload only images.', 400), false);
        }
    };

    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });

    return upload;
}

export const uploadImage = (fileName) => multerOptions().single(fileName);