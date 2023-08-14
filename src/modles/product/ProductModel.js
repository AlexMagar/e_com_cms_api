import ProductSchema from "./ProductSchema.js";

export const insertProduct = (obj) =>{
    return ProductSchema(obj).save();
}

export const getProducts = () =>{
    return ProductSchema.find()
}

export const getProductById = (_id) =>{
    return ProductSchema.findById(_id)
}

export const findOneProductByFilter = (filter) =>{
    return ProductSchema.findOne(filter)
}

export const updateProductByID = ({_id, ...rest}) =>{
    return ProductSchema.findByIdAndUpdate(_id, rest, {new: true})
}

//@filter, @updateobj must be an obj
export const updateProduct = (filter, updateObj) =>{
    return ProductSchema.findOneAndUpdate(filter, updateObj, {new: true})
}

export const deleteProductById = (_id) =>{
    return ProductSchema.findByIdAndDelete(_id);
}