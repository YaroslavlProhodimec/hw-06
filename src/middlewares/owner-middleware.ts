import {NextFunction, Request, Response} from "express";
import {commentsQueryRepository} from "../query-repositories/comments-query-repository";
import {HTTP_STATUSES} from "../setting";

export const ownerMiddlevare = async (req: Request, res: Response, next: NextFunction)=> {

    const commentId = req.params.commentId
    console.log(commentId, 'commentId')
    const comment = await commentsQueryRepository.getCommentById(commentId)
    console.log(comment, 'comment')

    if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    if (comment?.commentatorInfo.userId !== req.user?.id) {
        console.log('userId !== commentUser')
        return res.sendStatus(403)
    }
    if (comment?.commentatorInfo.userLogin !== req.user?.login) {
        console.log('userLogin !== commentLogin')

        return res.sendStatus(403)
    }
    next()
}