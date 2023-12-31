import express, { json } from 'express'
import { compairPassword, hashPassword } from "../utils/bcrypt.js";
import { newAdminValidation, newAdminVerificationValidation, loginValidation } from "../middleware/joiValidation.js";
import { getAdminByEmail, getAdminById, getAllAdmin, insertAdmin, updateAdmin, updateAdminById } from "../modles/admin/AdminModel.js"
import { accountVerificationEmail, accountVerifiedNotification, sendOPTNotifaction } from "../utils/nodeMailer.js";
import { v4 as uuidv4 } from 'uuid';
import { createAcessJWT, createRefreshJWT } from "../utils/jwt.js";
import { auth, refreshAuth } from '../middleware/authMiddleware.js';
import { deleteSession, insertSession } from '../modles/session/SessionModel.js';
import { otpGenerator } from '../utils/randomGenerator.js';


const router = express.Router();

//get admin details
router.get("/", auth, (req, res, next) =>{
    try {
        res.json({
            status: "success",
            message: " here is the user Info",
            user: req.userInfo,
        })
    } catch (error) {
        next(error)
    }
})

router.get("/display", auth, async (req, res, next) =>{
    try {
        const user = await getAllAdmin()
        res.json({
            status: "success",
            message: " here is the user Info",
            user,
        })
    } catch (error) {
        next(error)
    }
})

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

//check admin login 
router.post("/login", loginValidation, async (req, res, next) =>{

    try {
        //get the data from login form 
        const {email, password} = req.body;

        //check if user exit with received email and get user from db
        const user = await getAdminByEmail(email);


        if(user?._id){

            //use bcrypt to check if the pw is matching
            const isMatch = compairPassword(password, user.password)

            if(isMatch){
                // user.password = undefined
                // const {password, ...rest} = user;

                //create two jwts: 
                const accessJWT = await createAcessJWT(email)
                const refreshJWT = await createRefreshJWT(email)

                // create accessJWT and store in session table: short live 15
                // create accessJWT / refereshJWT ans store with user data in user table : long live 30d
                return res.json({
                    status: "success",
                    message: "Logedin Successfully",
                    token: {accessJWT, refreshJWT},
                })
            }
        }
        res.json({
            status: "Error",
            message: "Invalid Credentials"
        })

    } catch (error) {
        next(error)
    }
})

//return the refreshJWT
router.get("/get-accessjwt", refreshAuth)

//logout
router.post("/logout", async (req, res, next)=>{
    try {
        const {accessJWT, refreshJWT, _id} = req.body

        accessJWT && deleteSession(accessJWT);
        if(refreshJWT && _id) {
            const data = await updateAdminById({_id, refreshJWT: ""})
        }
        res.json({
            status: "success"
        })

    } catch (error) {
        next(error)
    }
})

// ====== reseting password ======
router.post("/request-opt", async (req, res, next) =>{
    try {
        const {email} = req.body

        console.log(email)

        if(email) {
            //check user exit

            const user = await getAdminByEmail(email);

            if(user?._id){
                //create 6 digit otp and store in session with email
                const otp = otpGenerator()

                //store otp and email in session table for future check

                const obj = {
                    token: otp,
                    associate: email,
                }

                const result = await insertSession(obj)

                if(result?._id) {
                    //send opt to their email
                    await sendOPTNotifaction({
                        otp,
                        email,
                        fName: user.fName
                    })
                }
            }
        }

        res.json({
            status: "success",
            message:" If your email exits in our system, you will get otp to your mailbox. Please check your email for the instruction and otp"

        })
    } catch (error) {
        next(error)
    }
})

router.post("/reset-password", async (req, res, next) =>{
    try {
        const { email, password, otp} = req.body

        if(email && password){
            //check if the token is valid

            const result = await deleteSessionByFilter({
                token: otp,
                associate: email,
            })

            if(result?._id){
                //check user exist

                const user = await getAdminByEmail(email)

                if(user?._id){
                    //encrypt the password

                    const hashPass = hashPassword(password)

                    const updatedUser = await updateAdmin(
                        {email},
                        {password: hashPass}
                    )

                    if(updatedUser?._id){
                        //send email notifaction

                        await passwordChangedNotification({
                            email, 
                            fName: updatedUser.fName,
                        })

                        return res.json({
                            status: "success",
                            message: " Your password has been updated, you may login now."
                        })
                    }
                }
            }
        }
        res.json({
            status: "error",
            message: "Invalid request or token"
        })
    } catch (error) {
        next(error)
    }
})


// update profile
router.put("/profile", async (req, res, next) => {
    console.log("From the  admin router profile put: ",req.body)

    try {

        const {_id, password, ...rest} = req.body 

        req.body.password = hashPassword(password)

        const user = await getAdminById(_id)

        if( user?._id){
            const isMatch = compairPassword(password, user.password)
            console.log("firrst: ", isMatch)
            if(isMatch){
                console.log("second")
                const result = await updateAdminById({_id, ...rest})
                console.log("third")
                result?._d && console.log("Success")
            }
            res.json({
                status: "success",
                message: "Profile is successfully updated"
            })
        }        
    } catch (error) {
        next(error)
    }

})

router.put("/profilePassword", async (req, res, next) => {
    const lg = req.body
    console.log("From the  admin router profile put: ",lg)

    try {

        const {_id, newPassword, currentPassword} = req.body 

        const password = hashPassword(newPassword)

        console.log("hello: ", req.body.newPassword)

        const user = await getAdminById(_id)

        if( user?._id){
            const isMatch = compairPassword(currentPassword, user.password)
            console.log("firrst: ", isMatch)
            if(isMatch){
                console.log("second")
                const result = await updateAdminById({_id, password})
                console.log("third")
                result?._id && console.log("Success")
            }
            res.json({
                status: "success",
                message: "Profile is successfully updated"
            })
        }        
    } catch (error) {
        next(error)
    }

})
export default router;