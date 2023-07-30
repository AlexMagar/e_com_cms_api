import express, { json } from 'express'
import { compairPassword, hashPassword } from "../utils/bcrypt.js";
import { newAdminValidation, newAdminVerificationValidation, loginValidation } from "../middleware/joiValidation.js";
import { getAdminByEmail, insertAdmin, updateAdmin } from "../modles/admin/AdminModel.js"
import { accountVerificationEmail, accountVerifiedNotification } from "../utils/nodeMailer.js";
import { v4 as uuidv4 } from 'uuid';
import { createAcessJWT, createRefreshJWT } from "../utils/jwt.js";
import { auth } from '../middleware/authMiddleware.js';


const router = express.Router();

//create new admin api
router.post("/", auth, newAdminValidation, async (req, res, next) =>{

    try {
        const {password} = req.body;
        req.body.password = hashPassword(password);

        //TODO create code and add with req.body
        req.body.verificationCode = uuidv4() //'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

        const result = await insertAdmin(req.body);

        if(result?._id){

            res.json({
                status: "success",
                message: "Please check your email and follow the instruction to activate your account",
            })

            const link = `${process.env.WEB_DOMAIN}/admin-verification?c=${result.verificationCode}&e=${result.email}`

            await accountVerificationEmail({
                fName: result.fName,
                email: result.email,
                link
            })
            return;
        }
       
        res.json({
            status: "error",
            message:"unable to add new Admin please try again" 
        })
    } catch (error) {
        
        if(error.message.includes("E11000 duplicate key error")){
            error.statusCode = 400
            error.message = "This email is already used by another Admin, Use different email or reset your password"
        }
        next(error)
    }
})


//check admin login 
router.post("/login", loginValidation, async (req, res, next) =>{
    try {
        //get the data from login form 
        const {email, password} = req.body;

        //check if user exit with received email and get user from db
        const user = await getAdminByEmail(email);


        if(user?._id){
            console.log("User found")

            //use bcrypt to check if the pw is matching
            const isMatch = compairPassword(password, user.password)

            if(isMatch){
                user.password = undefined
                // const {password, ...rest} = user;

                //create two jwts: 
                const accessJWT = await createAcessJWT(email)
                const refreshJWT = await createRefreshJWT(email)
                // create accessJWT and store in session table: short live 15
                // create accessJWT / refereshJWT ans store with user data in user table : long live 30d
                return res.json({
                    status: "Success",
                    message: "Logedin Successfully",
                    token: {accessJWT, refreshJWT}
                })
            }
        }
        res.json({
            status: "Error",
            message: "Invalid Credentials"
        })

    } catch (error) {
        res.json({
            status: "error",
            message: error.message
        })
    }
})


/// verify the new account
router.post("/admin-verification", newAdminVerificationValidation, async (req, res, next) =>{
    try {
        const {code, email} = req.body;
        const filter= {
            email: email,
            verificationCode: code
        }
        const updateObj = {
            isVerified: true,
            verificationCode: ""
        }
        console.log(filter, updateObj)
        const result = await updateAdmin(filter, updateObj)

        if(result?._id){
            await accountVerifiedNotification(result);
            res.json({
                status: "success",
                message: "Your account has been verified, you may login now"
            })
            return
        }

        res.json({
            status: "error",
            message:"Link is expired or invalid",
        })
    } catch (error) {
        next(error)
    }
})

export default router;