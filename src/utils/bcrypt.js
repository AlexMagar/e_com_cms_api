import bcrypt from 'bcryptjs'

const salt = 10

export const hashPassword = plainPass =>{
    return bcrypt.hashSync(plainPass, salt)
}

export const compairPassword = (plainPass, hasPassword) =>{
    return bcrypt.compareSync(plainPass, hasPassword)
}

