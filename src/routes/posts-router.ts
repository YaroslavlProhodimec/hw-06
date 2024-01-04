import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../setting";
import {inputValidationMiddleware} from '../middlewares/input-validation-middleware'
import {BlogViewModel} from "../models/blogs-models/blog-models";
import {postsService} from "../domain/posts-service";
import {PostViewModel} from "../models/posts-models/posts-models";
import {postsQueryRepository} from "../query-repositories/posts-query-repository";
import {blogsQueryRepository} from "../query-repositories/blogs-query-repository";
import {basicAuth, bearerAuth} from "../middlewares/auth-middleware";
import {validatePosts} from "../models/posts-models/posts-validate";
import {getPageOptions} from "../types/types";
import {commentsQueryRepository} from "../query-repositories/comments-query-repository";
import {commentsService} from "../domain/comments-service";
import {CommentViewModel} from "../models/comments-model/comments-models";
import {validateComments} from "../models/comments-model/comments-validate";
import {validateMongoId} from "../middlewares/mongoId-middleware";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const { pageNumber, pageSize, sortBy, sortDirection } = getPageOptions(req.query);

    const foundPosts = await postsQueryRepository.findPosts(pageNumber, pageSize, sortBy, sortDirection)
    res.send(foundPosts)
})

postsRouter.get('/:postId', async (req: Request, res: Response) => {
    const foundPost: PostViewModel | null = await postsQueryRepository.findPostById(req.params.postId)
    foundPost ? res.status(HTTP_STATUSES.OK_200).send(foundPost) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postsRouter.get('/:postId/comments',
    validateMongoId(),
    inputValidationMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const postId = req.params.postId
        const foundPost: PostViewModel | null = await postsQueryRepository.findPostById(postId)
        if (!foundPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const { pageNumber, pageSize, sortBy, sortDirection } = getPageOptions(req.query);
        const comments = await commentsQueryRepository.getCommentsForPost(req.params.blogId, pageNumber, pageSize, sortBy, sortDirection)
        if (!comments) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.send(comments)
    })

postsRouter.post('/:postId/comments',
    bearerAuth,
    validateComments(),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const {id: userId, login: userLogin} = req.user!
        const postId = req.params.postId
        const content = req.body.content
        console.log(postId, 'its post id')
        const newComment: CommentViewModel | null = await commentsService.createComment({userId, userLogin}, postId, content)
        if (!newComment) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        return res.status(HTTP_STATUSES.CREATED_201).send(newComment)
    }
)

postsRouter.post('/',
    basicAuth,
    validatePosts(),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newPost = await postsService.createPost(req.body)
        newPost ? res.status(HTTP_STATUSES.CREATED_201).send(newPost) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

postsRouter.put('/:postId',
    basicAuth,
    validatePosts(),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const blogId = req.body.blogId
        const postId = req.params.postId
        const blogExist: BlogViewModel | null = await blogsQueryRepository.findBlogById(blogId)
        const postExist = await postsQueryRepository.findPostById(postId)

        if (!blogExist) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send("error blog")
            return
        }
        if (!postExist) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send("error post")
            return
        }
        await postsService.updatePost(postId, req.body)
        res.status(HTTP_STATUSES.NO_CONTENT_204).send('No content')
    })

postsRouter.delete('/:postId',
    basicAuth,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(req.params.postId)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })