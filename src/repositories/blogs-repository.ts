import {blogsCollection} from "../db/db";
import {BlogDbModel, blogMapper, BlogViewModel, UpdateBlogModel} from "../models/blogs-models/blog-models";
import {InsertOneResult, ObjectId} from "mongodb";

export const blogsRepository = {

    async createBlog(newBlog: BlogDbModel): Promise<BlogViewModel> {
        const result: InsertOneResult<BlogDbModel> = await blogsCollection.insertOne({...newBlog})
        return blogMapper({_id: result.insertedId, ...newBlog})
    },

    async updateBlog(id: string, body: UpdateBlogModel ): Promise<boolean> {
        if(!ObjectId.isValid(id)) return false
        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) return false
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async deleteAll() {
        const result = await blogsCollection.deleteMany({})
    }

}