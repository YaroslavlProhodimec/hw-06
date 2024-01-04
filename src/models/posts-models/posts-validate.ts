import {body} from "express-validator";
import {blogsQueryRepository} from "../../query-repositories/blogs-query-repository";

export const validatePosts = () => [
    body('title')
        .isString()
        .trim()
        .notEmpty()
        .isLength({max: 30})
        .withMessage('errors in title'),
    body('shortDescription')
        .isString()
        .trim()
        .notEmpty()
        .isLength({max: 100})
        .withMessage('errors in shortDescription'),
    body('content')
        .isString()
        .trim()
        .notEmpty()
        .isLength({max: 1000})
        .withMessage('errors in content'),
    body('blogId')
        .isString()
        .trim()
        .notEmpty()
        .custom(async value => {
            const blog = await blogsQueryRepository.findBlogById(value)
            if (!blog) throw new Error('blog not found')
            return true
        })
        .withMessage('errors in blogId'),
]