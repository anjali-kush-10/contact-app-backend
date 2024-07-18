import { body, validationResult } from 'express-validator';
import { customError } from '../Helper/helper.js';

export const userRegister = () => {
    return ([
        body('email').isEmail().withMessage('Please enter a valid email address.'),
        body('password').isLength({ min: 6 }, { max: 10 }).withMessage('Password must be at least 6 characters long.')
    ]);
}

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    // return res.json(errors.errors[0].msg)
    if (!errors.isEmpty()) {
        const firstError = { message: errors.errors[0].msg }
        customError(req, res, firstError);
    }
    else {
        next();
    }
};
