import ProductSchema from "./ProductSchema.js";

export const insertProduct = (obj) =>{
    return ProductSchema(obj).save();
}

export const getProducts = () =>{
    return ProductSchema.find()
}

export const updateProductByID = ({_id, ...rest}) =>{
    return ProductSchema.findByIdAndUpdate(_id, rest)
}

export const findOneProductByFilter = (filter) =>{
    return ProductSchema.findOne(filter)
}

//@filter, @updateobj must be an obj
export const updateProduct = (filter, updateObj) =>{
    return ProductSchema.findOneAndUpdate(filter, updateObj, {new: true})
}

export const deleteProductById = (_id) =>{
    return ProductSchema.findByIdAndDelete(_id);
}