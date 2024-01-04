import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../setting";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {UserViewModel} from "../models/users-models/users-models";
import {ObjectId} from "mongodb";


export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization
    if (!authHeader) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }
    const [authType, authValue] = authHeader.split(' ')
    if (authType !== 'Basic') return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    const decodedToken = Buffer.from(authValue, "base64").toString()
    const [login, password] = decodedToken.split(":")
        // atob(authValue).split(':') // проверить atob
    if (login !== 'admin' || password !== 'qwerty') return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    next()
}

export const bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization']
    if (!auth) {
        return res.send(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }
    const token = auth.split(' ')[1]  //bearer fasdfasdfasdf

    const userId = await jwtService.getUserIdByToken(token)
    console.log(userId, 'its userid')
    if (!userId) return  res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    if(!ObjectId.isValid(userId)) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    const user: UserViewModel | null = await usersService.findUserById(userId)
    if (user) {
        req.user = user
        return next()
    }
    console.log('not user')
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
}