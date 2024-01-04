import {Paginator} from "../models/blogs-models/blog-models";
import {PostDbModel, postMapper, PostViewModel} from "../models/posts-models/posts-models";
import {postsCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";

export const postsQueryRepository = {

    async findPosts(page: number,
                    pageSize: number,
                    sortBy: string,
                    sortDirection: string): Promise<Paginator<PostViewModel>> {

        let sortOptions: { [key: string]: 1 | -1}  = {
            [sortBy]: -1
        }
        if (sortDirection === "asc") {
            sortOptions[sortBy] = 1
        }
        const totalCount = await postsCollection.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const scip = (page - 1) * pageSize
        const post = await postsCollection
            .find({})
            .sort(sortOptions)
            .skip(scip)
            .limit(pageSize)
            .toArray()
        console.log(totalCount, 'its totalCount')

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: post.map(postMapper)
        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        if (!ObjectId.isValid(id)) return null
        const post: WithId<PostDbModel> | null = await postsCollection.findOne({_id: new ObjectId(id)})
        return post ? postMapper(post) : null
    },

}