import jwt from 'jsonwebtoken'

const supersecretnotsosecretkey = 'p90q834ynyf5vtruq349po'

export function signPayload(payload, action, redirect) {
    const token = jwt.sign({
        action,
        redirect,
        data: payload
    }, supersecretnotsosecretkey)
    return token
}

export function validatePayload(token) {
    const validated = jwt.verify(token, supersecretnotsosecretkey, (err, decoded) => { 
        if (err) console.error(err)
        else return decoded
    })
    if (!validated || !validated.redirect || !validated.action) throw new Error("FAILED TO VALIDATE LOADING PAYLOAD")
    return validated
}