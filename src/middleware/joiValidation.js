import Joi from 'joi'

const SHORTSTR = Joi.string().min(3).max(100)
const  SHORTSTRREQ = Joi.string().min(3).max(100).required();

// =========== admin ==========
export const newAdminValidation = (req, res, next) =>{
    try {
        //define the schema
        const schema = Joi.object({
            fName: SHORTSTR,
            lName: SHORTSTR,
            email: Joi.string().email({minDomainSegments: 2}).required(),
            phone: Joi.string().required(),
            address: Joi.string().allow(""),
            password: Joi.string().required().min(6)
        })

        const { error} = schema.validate(req.body)

        //check data against the rule
        error ? res.json({
            status: 'error',
            message:error.message
        })
        : next()

    } catch (error) {
        next(error)
    }
}

export const loginValidation = (req, res, next) =>{
    try {
        //define the schema
        const schema = Joi.object({
            email: Joi.string().email({minDomainSegments: 2}).required(),
            password: Joi.string().required().min(6)
        })

        const { error} = schema.validate(req.body)

        //check data against the rule
        error 
        ? res.json({
            status: 'error',
            message:error.message
            })
        : next()

    } catch (error) {
        next(error)
    }
}

export const newAdminVerificationValidation = (req, res, next) =>{
    try {
        //define the schema
        const schema = Joi.object({
            email: Joi.string().email({minDomainSegments: 2}).required(),
            code: Joi.string().required(),
        })

        const { error} = schema.validate(req.body)

        //check data against the rule
        error ? res.json({
            status: 'error',
            message:error.message
        })
        : next()

    } catch (error) {
        next(error)
    }
}


// ======== category =========

export const upadteCategoryValidation = (req, res, next) =>{
    try {
        //define the schema
        const schema = Joi.object({
            email: Joi.string().email({minDomainSegments: 2}).required(),
            code: Joi.string().required(),
        })

        const { error} = schema.validate(req.body)

        //check data against the rule
        error ? res.json({
            status: 'error',
            message:error.message
        })
        : next()

    } catch (error) {
        next(error)
    }
}


// ============== paymenyt options ============== 

export const newPOValidation = (req, res, next) =>{
    try {
        //define the schema
        const schema = Joi.object({
            status: SHORTSTRREQ,
            title: SHORTSTRREQ,
            description: SHORTSTRREQ,
        })

        const { error } = schema.validate(req.body)

        //check data against the rule
        error ? res.json({
            status: 'error',
            message:error.message
        })
        : next()

    } catch (error) {
        next(error)
    }
}