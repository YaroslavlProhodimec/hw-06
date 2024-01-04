import {postsCollection} from "../db/db";
import {PostDbModel, postMapper, PostViewModel, UpdatePostModel} from "../models/posts-models/posts-models";
import {InsertOneResult, ObjectId} from "mongodb";


export const postsRepository = {

    async createPost(newPost: PostDbModel): Promise<PostViewModel> {
        const result: InsertOneResult<PostDbModel> = await postsCollection.insertOne({...newPost})
        return postMapper({_id: result.insertedId, ...newPost})
    },

    async updatePost(postId: string, body: UpdatePostModel) {
        if(!ObjectId.isValid(postId)) return false

        const result = await postsCollection.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,

            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string) {
        if(!ObjectId.isValid(id)) return false
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async deleteAll() {
        return  await postsCollection.deleteMany({})
    },

}