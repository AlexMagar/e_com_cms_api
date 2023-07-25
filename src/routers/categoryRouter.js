import express from 'express'

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


router.post("/", (req, res, next) =>{
    try {
        
    } catch (error) {
        if(error.message.incules("E11000 duplicate key error")){
            error.statusCode = 200;
            error.message = "The slug for the category already exist, please change the catgegory name ans try again.";
        }
        next(error)
    }
})

export default router;