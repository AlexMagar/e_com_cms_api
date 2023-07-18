import express from 'express'
import { addCmsAdmin, getCmsAdmin } from '../modles/cms/cmsModel.js';

const router = express.Router();

router.get("/", async (req, res) =>{
    try {
        const cmsAdmin = await getCmsAdmin()
        res.json({
            status: "Success",
            message: "Here are the cms get method",
            cmsAdmin,
        })
    } catch (error) {
        res.json({
            status: "Error",
            message: error.message,
        })
    }
})

router.post("/", async (req, res) =>{

    try {
        const result = req.body;
        const rst = await addCmsAdmin(result);
        res.json({
            status: "success",
            message: "From cms post method",
            rst
        })
    } catch (error) {
        res.json({
            status: "Error",
            message: error.message
        })
    }
})
export default router;