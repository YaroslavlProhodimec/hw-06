import {WithId} from "mongodb";

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentDbModel = {
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentWidthPostModel = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}
export const commentMapper = (comment: WithId<CommentDbModel>): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt
    }
}
