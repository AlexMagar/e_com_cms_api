import express from 'express'
import { getCategories, insertCategory, updateCategoryByID, deleteCategoryById } from "../modles/category/CategoryModel.js";
import slugify from "slugify";
import { upadteCategoryValidation } from "../middleware/joiValidation.js";

const router = express.Router();

router.get("/", async (req, res, next) =>{
    try {
        const result = await getCategories();

        res.json({
            status: "success",
            message: "New Category has been added",
            result,
        })

    } catch (error) {
        next(next)
    }
})


router.post("/", async (req, res, next) =>{
    try {
        const { title } = req.body

        !title && 
            res.json({
                status: "error",
                message: "Category title is required"
            })

        const obj = {
            title,
            slug: slugify(title, {trim: true, lower: true}),
        }

        const result = await insertCategory(obj);

        result?._id
            ? res.json({
                status: "success",
                message: "New category has been added",
            })
            : res.json({
                status: "error",
                message: "Error, unable to add new category"
            })

    } catch (error) {
        if(error.message.incules("E11000 duplicate key error")){
            error.statusCode = 200;
            error.message = "The slug for the category already exist, please change the catgegory name ans try again.";
        }
        next(error)
    }
})

router.put("/", upadteCategoryValidation,  async (req, res, next) =>{
    try {
        const result = await updateCategoryByID(req.body)

        result?._id
            ? res.json({
                status: "success",
                message: "New category has been added",
            })
            : res.json({
                status: "error",
                message: "Error, unable to add new category"
            })

    } catch (error) {
        next(error)
    }
})

router.delete("/:_id", async (req, res, next) =>{
    const {_id} = req.params

    try {
        if(_id){
            const result = await deleteCategoryById(_id)
            result?._id && 
            res.json({
                status: "success",
                message: "The category has been deleted"
            })
            return
        }

        res.json({
            status: "error",
            message: "Error, unable to process your request"
        })
    } catch (error) {
        next(error)
    }
})

export default router;