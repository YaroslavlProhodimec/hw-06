import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUSES} from "../setting";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {jwtService} from "../application/jwt-service";
import {bearerAuth} from "../middlewares/auth-middleware";
import {WithId} from "mongodb";
import {UserDbModel} from "../models/users-models/users-models";
import {validateAuthorization} from "../models/auth-models/auth-validate";
import {usersQueryRepository} from "../query-repositories/users-query-repository";

export const authRouter = Router()

authRouter.post('/login',
    validateAuthorization(),
    inputValidationMiddleware,
    async (req: Request, res: Response): Promise<void>  => {
    const user: WithId<UserDbModel> | null  = await usersService.checkCredentials(req.body)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(HTTP_STATUSES.OK_200).send({accessToken: token})
            console.log(token)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        }
    }
)


        authRouter.get('/me' ,
            bearerAuth,
            async (req: Request, res: Response) => {
            const userId = req.user!.id
                const currentUser = await usersQueryRepository.findCurrentUser(userId)
                console.log(currentUser)
                if (!currentUser) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                res.send({
                    email: currentUser.email,
                    login: currentUser.login,
                    userId: currentUser.id
                })
        })

