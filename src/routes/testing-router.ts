import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {HTTP_STATUSES} from "../setting";
import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    blogsRepository.deleteAll()
    postsRepository.deleteAll()
    usersRepository.deleteAll()
    commentsRepository.deleteAll()

    res.status(HTTP_STATUSES.NO_CONTENT_204).send('All data is deleted')
})
