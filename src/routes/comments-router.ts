import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {commentsService} from "../domain/comments-service";
import {HTTP_STATUSES} from "../setting";
import {commentsQueryRepository} from "../query-repositories/comments-query-repository";
import {CommentViewModel} from "../models/comments-model/comments-models";
import {bearerAuth} from "../middlewares/auth-middleware";
import {validateComments} from "../models/comments-model/comments-validate";
import {ownerMiddlevare} from "../middlewares/owner-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId',
    async (req: Request, res: Response) => {
    const foundComment: CommentViewModel | null = await commentsQueryRepository.getCommentById(req.params.commentId)
    foundComment ? res.status(HTTP_STATUSES.OK_200).send(foundComment) :
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

commentsRouter.put('/:commentId',
    bearerAuth,
    validateComments(),
    inputValidationMiddleware,
    ownerMiddlevare,
    async (req: Request, res: Response) => {

        const commentId = req.params.commentId
        const isUpdated = await commentsService.updateComment(commentId, req.body)
        isUpdated ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

commentsRouter.delete('/:commentId',
    bearerAuth,
    async (req: Request, res: Response) => {
        const isDeleted = await commentsService.deleteComment(req.params.commentId)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })