import { body, validationResult } from 'express-validator';
import { customError } from '../Helper/helper.js';

export const contactValidation = () => {
    return ([
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('address').trim().notEmpty().withMessage('Address is required'),
        body('contact_no').trim().notEmpty().withMessage('Contact number is required').isMobilePhone('any').withMessage('Contact number must be a valid phone number'),


    ]);
}

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    // return res.json(errors.errors[0].msg)
    if (!errors.isEmpty()) {
        const firstError = { message: errors.errors[0].msg }
        customError(req, res, firstError);
    }
    // else if (!req.file || !req.file.profile_image) {
    //     res.status(400).json({ status: false, "message": 'Profile image is required' });
    // }
    else {
        next();
    }
};
