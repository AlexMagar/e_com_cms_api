import { getAdminByEmail } from "../modles/admin/AdminModel.js"
import { verifyAccessJWT } from "../utils/jwt.js"


export const auth = async (req, res, next) =>{
    try {

        //1. get the accessJWT
        const {authorization} = req.headers
        console.log(authorization)

        //2. decode the jwt
        const decoded = verifyAccessJWT(authorization)
        console.log(decoded)

        //3. extract the email and get user by email
        if(decoded?.email){
            //4. check if user is active
            const user = await getAdminByEmail(decoded?.email)
            console.log(user)

            if(user?._id && user?.status){
                return next();
            }
        }
        res.status(401).json({
            status: 'error',
            message: "unauthorize"
        })
    } catch (error) {
        if(error.message.includes("jwt expired")){
            error.statusCode = 403
            error.message = error.message
        }
        if(error.message.includes("invalid signature")){
            error.statusCode = 401
            error.message = error.message
        }
        next(error)
    }
}