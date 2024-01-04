import {UserDbModel, userMapper, UserViewModel} from "../models/users-models/users-models";
import {usersCollection} from "../db/db";
import {InsertOneResult, ObjectId, WithId} from "mongodb";


export const usersRepository = {

    async getAllUsers() {
        return usersCollection
            .find()
            .sort('createdAt', -1)
            .toArray()
    },

    async createUser(user: UserDbModel): Promise<UserViewModel> {
        const result: InsertOneResult<UserDbModel> = await usersCollection.insertOne({...user})
        return userMapper({_id: result.insertedId, ...user})
    },

    async findUserById(id: ObjectId) {
        let product = await usersCollection.findOne({_id: id})
        return product ? product : null
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbModel> | null> {
        const user = await usersCollection.findOne({ $or: [ { email: loginOrEmail }, { login: loginOrEmail } ] } )
        return user
    },

    async deleteUser(id: string): Promise<boolean> {
        if(!ObjectId.isValid(id)) return false
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async deleteAll() {
        return  usersCollection.deleteMany({})
    },

}