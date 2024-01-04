import bcrypt from 'bcryptjs'
// import bcrypt from 'bcrypt' //ошибка на bcrypt
import {CreateUserInputModel, UserDbModel, userMapper, UserViewModel} from "../models/users-models/users-models";
import {usersRepository} from "../repositories/users-repository";
import {ObjectId, WithId} from "mongodb";
import {LoginInputModel} from "../models/auth-models/auth-models";


export const usersService = {

    async findUserById(userId: ObjectId | null) {
        const user = await usersRepository.findUserById(userId!)
        if (!user) return null
        return userMapper(user)

    },

    async createUser(body: CreateUserInputModel): Promise<UserViewModel> {
        const passwordHash = await bcrypt.hash(body.password, 10)
        const newUser: UserDbModel = {
            login: body.login,
            email: body.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
        }
        return usersRepository.createUser(newUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    },

    async checkCredentials(body: LoginInputModel) {
        const user: WithId<UserDbModel> | null = await usersRepository.findByLoginOrEmail(body.loginOrEmail)
        if (!user) return null
        const compare = await bcrypt.compare(body.password, user.password)
        if (compare) {
            return user
        }
        return null
    },
}