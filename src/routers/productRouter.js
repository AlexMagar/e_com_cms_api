import express from 'express'
import { deleteProductById, getProductById, getProducts, insertProduct, updateProductByID } from '../modles/product/ProductModel.js';
import { newProductValidation, updateProductValidation } from '../middleware/joiValidation.js';
import slugify from 'slugify';
import multer from 'multer';

const router = express.Router();

const imgFolderPath = "public/img/product"
//setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let error = null
        //validation check
        cb(error, imgFolderPath)
    },
    filename: (req, file, cb) => {
        let error = null

        //construct or rename file name
        const fullFileName =  Date.now() + "-" + file.originalname
        cb(error, fullFileName )
    }
})

const upload = multer({storage})
//where do you want to store the file
//what name do you wnat to give to

router.get("/:_id?", async (req, res, next) =>{
    try {
        const { _id} = req.params;
        const products = _id ? await getProductById(_id) : await getProducts(); 

        res.json({
            status: "success",
            message: "Here are the products",
            products,
        })

    } catch (error) {
        next(next)
    }
})

router.post("/", upload.array("images", 5),  newProductValidation, async (req, res, next) =>{
    try {

        if(req.files.length){
            req.body.images = req.files.map( item => item.path)
            req.body.thumbnail = req.body.images[0]
        }

        req.body.slug = slugify(req.body.name, {trim: true, lower: true})

        const result = await insertProduct(req.body);

        result?._id 
        ? res.json({
            status: "success",
            message: "The new products has been added successfully",
        })
        : res.json({
            status: "error",
            message: "Unable to add new product, try again later",
        })

    } catch (error) {
        if (error.message.includes("E11000 duplicate key error collection")) {
            error.statusCode = 200;
            error.message = "The product slug or sku alread related to another product, change name and sku and try agin later.";
          }
      
        next(next)
    }
})

router.put("/", upload.array("images", 5),  updateProductValidation, async (req, res, next) =>{
    try {

        if(req.files.length){
            const newImgs = req.files.map( item => item.path)
            req.body.images = [...req.body.images, ...newImgs]
            // req.body.thumbnail = req.body.images[0]
        }

        // req.body.slug = slugify(req.body.name, {trim: true, lower: true})

        const result = await updateProductByID(req.body);

        result?._id 
        ? res.json({
            status: "success",
            message: "The new products has been updated successfully",
        })
        : res.json({
            status: "error",
            message: "Unable to update product, try again later",
        })

    } catch (error) {
        if (error.message.includes("E11000 duplicate key error collection")) {
            error.statusCode = 200;
            error.message = "The product slug or sku alread related to another product, change name and sku and try agin later.";
          }
      
        next(next)
    }
})

router.delete("/:_id", async (req, res, next) =>{
    try {

        const {_id} = req.params

        const result = await deleteProductById(_id);

        result?._id 
        ? res.json({
            status: "success",
            message: "Here are the Producd has been deleted successfully",
        })
        : res.json({
            status: "error",
            message: "Error deleting product",

        })

    } catch (error) {
        next(error)
    }
})

export default router;