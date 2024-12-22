import express from 'express';

import { 
    signup,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} from '../Controller/authController.js';

import { 
    signupValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from '../Utils/validator/authValidator.js';

const authRouter = express.Router();

authRouter.post('/signup', signupValidator, signup);
authRouter.post('/login', loginValidator, login);
authRouter.post('/forgot-password', forgotPasswordValidator, forgotPassword);
authRouter.post('/verify-reset-code', verifyResetCode);
authRouter.put('/reset-password', resetPasswordValidator, resetPassword);

export default authRouter;