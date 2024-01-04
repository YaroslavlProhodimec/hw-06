import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
export const jwtService = {
    async createJWT(user: any) {
        const token = jwt.sign({userId: user._id},settings.JWT_SECRET,{expiresIn: '3h'})
        return token
    },
    async getUserIdByToken(token:any){
        try {
            const result:any = jwt.verify(token,settings.JWT_SECRET)
            return  result.userId
        } catch (e) {
            return null
        }
    }
}

// export const jwtService = {
//     async createJWT(user: any) {
//         const token = jwt.sign({ userId: user._id.toString() }, settings.JWT_SECRET, { expiresIn: '3h' });
//         console.log(token, 'token createJWT');
//         return token;
//     },
//     async getUserIdByToken(token: any) {
//         console.log(token, 'getUserIdByToken');
//         try {
//             const result: any = jwt.verify(token, settings.JWT_SECRET);
//             console.log(result, 'result');
//             return result.userId; // Если result.userId уже строка, преобразование в ObjectId не требуется
//         } catch (e) {
//             console.log(e, 'e e e');
//             return null;
//         }
//     },
// };
