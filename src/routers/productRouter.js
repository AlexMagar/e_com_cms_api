import express from 'express'
import { deleteProductById, insertProduct } from '../modles/product/ProductModel';
import { newProductValidation } from '../middleware/joiValidation';
import slugify from 'slugify';

const router = express.Router();

router.get("/", async (req, res, next) =>{
    try {
        // const result = await getCategories();

        res.json({
            status: "success",
            message: "The new Producd has been added successfully",
            result,
        })

    } catch (error) {
        if(error.message.includes("E11000 duplicate key error collection")){
            error.statusCode = 200,
            error.message = "The product slug or sku already related to another product"
        }
        next(next)
    }
})

router.post("/", newProductValidation, async (req, res, next) =>{
    try {

        req.body.slug = slugify(req.body.name, {trim: true, lower: true})

        const result = await insertProduct(req.body);

        result?._id 
        ? res.json({
            status: "success",
            message: "Here are the Producd",
            result,
        })
        : res.json({
            status: "error",
            message: "Producd lnot found",

        })

    } catch (error) {
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
            result,
        })
        : res.json({
            status: "error",
            message: "Error deleting product",

        })

    } catch (error) {
        next(next)
    }
})


export default router;