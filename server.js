import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import mongoConnect from './src/config/mongoConfig.js'
import adminRouter from './src/routers/adminRouter.js'
import categoryRouter from "./src/routers/categoryRouter.js";
import paymentOptionRouter from "./src/routers/paymentOptionRouter.js";
import { auth } from './src/middleware/authMiddleware.js';
import productRouter from "./src/routers/productRouter.js";
import { path } from "path";

const PORT = process.env.PORT || 8000

const app = express()

//mongodb
mongoConnect();

//middleware
app.use(express.json()) //to receive the data send as json
app.use(cors());
app.use(morgan('dev'))

const __dirname = path.resolve() //get root path
//converting public folder to static serving folder
app.use(express.static(path.join(__dirname, "/public")))

//apis
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/category", auth, categoryRouter);
app.use("/api/v1/payment-option", auth, paymentOptionRouter);
app.use("/api/v1/product", auth, productRouter)

// default apis
app.use("/", (req, res) =>{
    res.json({
        status: "success",
        message: "Server running well"
    })
})

app.use((error, req, res, next) =>{
    const code = error.statusCode || 500;
    res.status(code).json({
        status: "error",
        message: error.message
    })
})

// PORT listen
app.listen(PORT, (err) =>{
    err 
    ? console.log(err.message)
    : console.log(`Server running at http://localhost:${PORT}`)
})
