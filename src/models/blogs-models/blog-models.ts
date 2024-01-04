import {WithId} from "mongodb";

export type BlogDbModel = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type CreateBlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type UpdateBlogModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type Paginator<BlogViewModel> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items:	BlogViewModel[]
}

export const blogMapper = (blog: WithId<BlogDbModel>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}