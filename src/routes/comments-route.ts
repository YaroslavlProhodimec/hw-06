import {Response, Router} from "express";
import {CommentsRepository} from "../repositories/comments-repository";
import {HTTP_STATUSES} from "../utils/common";
import {bearerAuth} from "../middlewares/auth/auth-middleware";
import {PostRepository} from "../repositories/post-repository";
import {commentsCollection} from "../index";

export const commentsRoute = Router({})

commentsRoute.get('/:id',

    async (req: any, res: Response) => {
        console.log(req, 'req')
        const comment = await CommentsRepository.getCommentById(req.params.id)

        if (comment) {
            res.status(HTTP_STATUSES.OK_200).json(comment)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

commentsRoute.delete('/:id',
    bearerAuth,
    async (req: any, res: Response) => {
        // const user = await commentsCollection.findOne({"commentatorInfo.userId": req.user.userId})
        // console.log(user, 'user')
        // console.log(req.params.id,'req.params.id')
        // if (user!.userId !== req.params.id) {
        //     res.sendStatus(403)
        //     return
        // }
        let idDeleted = await CommentsRepository.deleteComment(req.user._id,req.params.id)
        if(idDeleted === null){
            res.sendStatus(403)
        }
        if (idDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })





