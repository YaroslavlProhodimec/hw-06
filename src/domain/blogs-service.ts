import {BlogDbModel, BlogViewModel, CreateBlogInputModel, UpdateBlogModel} from "../models/blogs-models/blog-models";
import {blogsRepository} from "../repositories/blogs-repository";


export const blogsService = {

    async createBlog(body: CreateBlogInputModel): Promise<BlogViewModel> {

        const newBlog: BlogDbModel = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return blogsRepository.createBlog(newBlog)
    },

    async updateBlog(id: string, body: UpdateBlogModel): Promise<boolean> {
        return await blogsRepository.updateBlog(id, body)
    },

    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },

    async deleteAll() {
        return await blogsRepository.deleteAll()
    },
}