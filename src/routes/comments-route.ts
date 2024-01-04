import {Response, Router} from "express";
import {CommentsRepository} from "../repositories/comments-repository";
import {HTTP_STATUSES} from "../utils/common";
import {bearerAuth} from "../middlewares/auth/auth-middleware";
import {commentsValidation} from "../validators/comments-validator";


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

commentsRoute.put('/:id',
    bearerAuth,
    commentsValidation(),
    async (req: any, res: Response) => {

        const content = req.body.content
        const isUpdated = await CommentsRepository.updateComment(req.params.id, content,req.user)
        if(isUpdated === null){
            res.sendStatus(403)
            return;
        }
        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

commentsRoute.delete('/:id',
    bearerAuth,
    async (req: any, res: Response) => {

        let idDeleted = await CommentsRepository.deleteComment(req.user._id,req.params.id)
        if(idDeleted === null){
            res.sendStatus(403)
            return;
        }
        if (idDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })





