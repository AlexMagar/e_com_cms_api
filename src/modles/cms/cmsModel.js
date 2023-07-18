import cmsSchema from "./cmsSchema.js";

export const getCmsAdmin = () =>{
    return cmsSchema.find();
}

export const addCmsAdmin = (obj) =>{
    return cmsSchema(obj).save()
}