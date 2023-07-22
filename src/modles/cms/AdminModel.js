import AdminSchema from "./AdminSchema.js";


export const insertAdmin = (obj) =>{
    return AdminSchema(obj).save()
}

export const getAdminByEmail = (email) =>{
    return AdminSchema.findOne({email});
}

export const updateAdminById = ({_id, ...rest}) =>{
    return AdminSchema.findByIdAndUpdate(_id, rest);
}
export const deleteAdmin = (_id) =>{
    return AdminSchema.findByIdAndDelete(_id);
}