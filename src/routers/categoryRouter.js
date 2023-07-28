import express from 'express'
import { getCategories, insertCategory } from "../modles/category/CategoryModel.js";
import slugify from "slugify";

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
                result
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

export default router;