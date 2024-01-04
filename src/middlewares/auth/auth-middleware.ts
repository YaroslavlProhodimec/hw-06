import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils/common";
import {jwtService} from "../../domain/jwt-service";
import {usersCollection} from "../../index";
import {ObjectId} from "mongodb";


const login = 'admin'
const password = 'qwerty'


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(401)
        return
    }

    const [basic, token] = auth.split(' ')

    if (basic !== 'Basic') {
        res.sendStatus(401)
        return;
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(':')

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(401)
        return;
    }

    return next()

}

export const bearerAuth = async (req: any, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.send(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    console.log(userId, 'userId await jwtService.getUserIdByToken(token)')

    let id =  new ObjectId(userId)
    if (userId) {
        req.user = await usersCollection.findOne({_id: id })
        console.log(req.user,'req.user ')
        return next()
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    // res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}