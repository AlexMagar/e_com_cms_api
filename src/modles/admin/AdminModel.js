import AdminSchema from "./AdminSchema.js";


export const insertAdmin = (obj) =>{
    return AdminSchema(obj).save()
}

export const getAdminByEmail = (email) =>{
    return AdminSchema.findOne({email});
}

export const getAdminById = (_id) =>{
    return AdminSchema.findOne({_id})
}

export const getOneAdmin = (filter) =>{
    return AdminSchema.findOne({filter});
}
export const getAllAdmin = () =>{
    return AdminSchema.find();
}

export const updateAdminById = ({_id, ...rest}) =>{
    return AdminSchema.findByIdAndUpdate(_id, rest);
}

//@filter and @updateObj must ne an obj
export const updateAdmin = (filter, updateObj) =>{
    return AdminSchema.findOneAndUpdate(filter, updateObj, {new: true});
}

export const deleteAdmin = (_id) =>{
    return AdminSchema.findByIdAndDelete(_id);
}