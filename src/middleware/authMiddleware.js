import { getAdminByEmail, getOneAdmin } from "../modles/admin/AdminModel.js"
import { createAcessJWT, verifyAccessJWT, verifyRefreshJWT } from "../utils/jwt.js"


export const auth = async (req, res, next) =>{
    try {

        //1. get the accessJWT
        const {authorization} = req.headers

        //2. decode the jwt
        const decoded = verifyAccessJWT(authorization)
     

        //2a TODO make sure token exist in database

        //3. extract the email and get user by email
        if(decoded?.email){
            //4. check if user is active
            const user = await getAdminByEmail(decoded.email)
            

            if(user?._id && user?.status === "active"){
                user.refreshJWT = undefined
                user.password = undefined
                req.userInfo = user
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


export const refreshAuth = async (req, res, next) =>{
    try {
          //1. get the accessJWT
          const {authorization} = req.headers
          console.log(authorization)
  
          //2. decode the jwt
          const decoded = verifyRefreshJWT(authorization)
          console.log("Here is my decoded email: authMiddleware ",decoded)

          //make sure data is in 
  
          //3. extract the email and get user by email
          if(decoded?.email){
              //4. check if user is active
              const user = await getOneAdmin({
                email: decoded.email,
                refreshJWT: authorization
            })
              console.log(user)
  
              if(user?._id && user?.status === "active"){
                //create new accessJWT
                const accessJWT = await createAcessJWT(decoded.email)
                  
                return res.json({
                    status: 'success',
                    accessJWT
                })
              }
          }
          res.status(401).json({
              status: 'error',
              message: "unauthorize"
          })
    } catch (error) {
        next(error)
    }
}