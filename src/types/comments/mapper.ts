import {WithId} from "mongodb";

export const commentsMapper = (comment: any): any => {
    return {
        id: comment.id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
    }
// {
//     "id": "string",
//     "content": "string",
//     "commentatorInfo": {
//     "userId": "string",
//         "userLogin": "string"
// },
//     "createdAt": "2024-01-04T09:35:46.339Z"
}