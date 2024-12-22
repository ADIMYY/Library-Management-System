import express from 'express';

import {
    currentlyBorrowedBooks,
    overdueBooks,
    systemActivityLogs,
    logAction
} from '../Controller/reportsAndLogsController.js';

import { protect, restrictTo } from '../Controller/authController.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.route('/reports/borrowed-books').get(currentlyBorrowedBooks);
router.route('/reports/overdue-books').get(overdueBooks);
router.route('/logs').get(systemActivityLogs);
router.route('/logs').post(logAction);

export default router;