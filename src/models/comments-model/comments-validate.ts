import {body} from "express-validator";

export const validateComments = () => [
    body('content')
        .isString()
        .trim()
        .notEmpty()
        .isLength({min: 20, max: 300})
        .withMessage('errors in content'),
]