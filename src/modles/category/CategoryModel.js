import CategorySchema from "./CategorySchema.js";

export const insertCategory = (obj) =>{
    return CategorySchema(obj).save();
}

export const getCategories = () =>{
    return CategorySchema.find()
}

export const updateCategoryByID = ({_id, ...rest}) =>{
    return CategorySchema.findByIdAndUpdate(_id, rest)
}

//@filter, @updateobj must be an obj
export const updateCategory = (filter, updateObj) =>{
    return CategorySchema.findOneAndUpdate(filter, updateObj, {new: true})
}

export const deleteCategory = (_id) =>{
    return CategorySchema.findByIdAndDelete(_id);
}