import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import mongoConnect from './src/config/mongoConfig.js'
import cmsRouter from './src/routers/cmsRouter.js'

const PORT = process.env.PORT || 8000

const app = express()

//mongodb
mongoConnect();

//middleware
app.use(express.json()) //to receive the data send as json
app.use(cors());
app.use(morgan('dev'))


//apis
app.use("/api/v1/cms", cmsRouter)

// default apis
app.use("/", (req, res) =>{
    res.json({
        status: "success",
        message: "Server running well"
    })
})


// PORT listen
app.listen(PORT, (err) =>{
    err 
    ? console.log(err.message)
    : console.log(`Server running at http://localhost:${PORT}`)
})
