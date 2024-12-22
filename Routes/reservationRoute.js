import express from 'express';

import { 
    reserveBook, 
    getReservations, 
    getUserReservations, 
    cancelReservation 
} from '../Controller/reservationController.js';

import {
    reserveBookValidator,
    cancelReservationValidator,
} from '../Utils/validator/reservationValidator.js';

import { protect } from '../Controller/authController.js';

const router = express.Router();

router.use(protect);

router.route('/myReservations').get(getUserReservations)
router.route('/').get(getReservations);
router
    .route('/:bookId')
    .post(reserveBookValidator, reserveBook)
    .delete(cancelReservationValidator, cancelReservation);

export default router;