import jwt from 'jsonwebtoken'
import { updateAdmin } from '../modles/admin/AdminModel.js'

export const createAcessJWT = async (email) =>{
    const token =  jwt.sign({email}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1m"
    })
    await insertSession({token, associate: email})

    return token
}

export const createRefreshJWT = async (email) =>{
    const refreshJWT =  jwt.sign({email}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d"
    })
    const dt = await updateAdmin({email}, {refreshJWT})

    return refreshJWT
}