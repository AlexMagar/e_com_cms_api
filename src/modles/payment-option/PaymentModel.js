import paymentOptionSchema from "./paymentOptionSchema.js";


export const insertPO = (obj) =>{
    return paymentOptionSchema(obj).save()
}

export const getPOs = (obj) => {
    return paymentOptionSchema.find()
}

export const updatePOById = ({_id, ...rest}) =>{
    return paymentOptionSchema.findByIdAndUpdate(_id, rest);
}

export const deletePO = (_id) =>{
    return paymentOptionSchema.findByIdAndDelete(_id);
}