import {WithId} from "mongodb";
import { ObjectId } from 'mongodb';

import {commentsCollection} from "../db/db";
import {CommentDbModel, commentMapper} from "../models/comments-model/comments-models";


export const commentsQueryRepository = {

    async getCommentById(id: string) {
        // if (!ObjectId.isValid(id)) return null // что с тобой не так?
        const comment: WithId<CommentDbModel> | null = await commentsCollection.findOne(
            {_id: new ObjectId(id)})
        return comment ? commentMapper(comment) : null
    },

    async getCommentsForPost(id: string,
                          pageNumber: number,
                          pageSize: number,
                          sortBy: string,
                          sortDirection: string) {
            let sortOptions: { [key: string]: 1 | -1}  = {
                [sortBy]: -1
            }
            if (sortDirection === "asc") {
                sortOptions[sortBy] = 1
            }
            const filter = {
                id: id
            }

            const totalCount = await commentsCollection.countDocuments(filter) // откуда он берет дополнительную единицу?
            const pagesCount = Math.ceil(totalCount / +pageSize)
            const scip = (+pageNumber - 1) * +pageSize
            const comments = await commentsCollection
                .find(filter)
                .sort(sortOptions)
                .limit(+pageSize)
                .skip(scip)
                .toArray();

            return comments ? {
                pagesCount,
                pageNumber,
                pageSize,
                totalCount,
                items: comments.map(commentMapper)
            } : null

    },
}