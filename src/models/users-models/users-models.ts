import {WithId} from "mongodb";

export type UserDbModel = {
    login: string
    email: string
    password: string
    createdAt: string
}

export type CreateUserInputModel = {
    login: string
    email: string
    password: string
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type Paginator<UserViewModel> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [UserViewModel]
}
export const userMapper = (user: WithId<UserDbModel>): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}