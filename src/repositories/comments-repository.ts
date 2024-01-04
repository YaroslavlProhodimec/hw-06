import {OutputPostType, PostType} from "../types/post/output";
import {commentsCollection, postCollection, usersCollection} from "../index";
import {ObjectId, WithId} from "mongodb";
import {BlogType} from "../types/blog/output";
import {postMapper} from "../types/post/mapper";
import {commentsMapper} from "../types/comments/mapper";
import {UpdatePostDto} from "../types/post/input";
import {BlogRepository} from "./blog-repository";

export class CommentsRepository {
    static async getAllCommentsQueryParam(sortData: any) {
        // searchNameTerm: req.query.searchNameTerm,
        //     sortBy: req.query.sortBy,
        //     sortDirection: req.query.sortDirection,
        //     pageNumber: req.query.pageNumber,
        //     pageSize: req.query.pageSize,
        // pageSize=3&pageNumber=1
        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const searchNameTerm = sortData.searchNameTerm ?? null
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }

        const comments: any = await commentsCollection.find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentsCollection
            .countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: comments.map(commentsMapper)
        }


    }

    static async getCommentById(id: any): Promise<OutputPostType | null> {
        try {
            console.log(id, 'id')
            const comment: any = await commentsCollection.findOne({id: new ObjectId(id)})
            console.log(comment, 'comment')
            if (!comment) {
                return null
            }
            return commentsMapper(comment)
        } catch (e) {
            return null
        }

    }

    static async createComments(content: string, id: string) {
        const createdAt = new Date()
        // {
        //     "id": "string",
        //     "content": "string",
        //     "commentatorInfo": {
        //     "userId": "string",
        //         "userLogin": "string"
        // },
        //     "createdAt": "2024-01-04T09:35:46.339Z"
        // }
        console.log(id, 'id')
        const user: any = await usersCollection.findOne({_id: id})
        console.log(user, 'await usersCollection.findOne({userId:id})')

        const commentId = new ObjectId()
        const newComment: any = {
            id: commentId,
            content,
            commentatorInfo: {
                userId: id,
                userLogin: user.login,
            },
            createdAt: createdAt.toISOString()
        }
        const result = await commentsCollection.insertOne(newComment)

        // {
        //     "id": "string",
        //     "content": "string",
        //     "commentatorInfo": {
        //     "userId": "string",
        //         "userLogin": "string"
        // },
        //     "createdAt": "2024-01-04T17:45:58.406Z"
        // }
        if (result) {
            const result: any = await commentsCollection.findOne({id: commentId})
            console.log(result, 'result commentsCollection.findOne({id:commentId})')
            return {
                id: result!.id,
                content: result!.content,
                commentatorInfo: {
                    userId: result.commentatorInfo.userId,
                    userLogin: result.commentatorInfo.userLogin,
                },
                createdAt: result!.createdAt,
            }
        } else {
            return null
        }
        //
    }

    static async updateComment(id: string, content: any, ) {

        let result = await commentsCollection.updateOne({id: new ObjectId(id)}, {
            $set: {
                content: content,
            }
        })

        return result.matchedCount === 1
    }

    static async deleteComment( id: string) {

        try {

            const result = await commentsCollection.deleteOne({id: new ObjectId(id)})
            return result.deletedCount === 1

        } catch (e) {

            return false

        }
    }
}