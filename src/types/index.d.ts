import {UserViewModel} from "../models/users-models/users-models";

declare global {
    namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}
