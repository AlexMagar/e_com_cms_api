import { token } from "morgan"
import SessionSchema from "./SessionSchema.js"


export const insertSession = (obj) =>{
   return SessionSchema(obj).save()
}

// @token should be string
export const deleteSession = async (token) =>{
   const data = await SessionSchema.findOneAndDelete({token})
}