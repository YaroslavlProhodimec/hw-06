import {InsertOneResult, ObjectId} from "mongodb";
import {commentsCollection} from "../db/db";
import {CommentDbModel, commentMapper, CommentViewModel} from "../models/comments-model/comments-models";


export const commentsRepository = {

    async createComment(newComment: CommentDbModel): Promise<CommentViewModel> {
        const result: InsertOneResult<CommentDbModel> = await commentsCollection.insertOne({...newComment})
        return commentMapper({_id: result.insertedId, ...newComment})
    },

    async updateComment(id: string, body: any): Promise<any> {
        if(!ObjectId.isValid(id)) return false

        const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: body.content
            }
        })
        return result.matchedCount === 1
    },

    async deleteComment(id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) return false
        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async deleteAll() {
        return  await commentsCollection.deleteMany({})
    },

}