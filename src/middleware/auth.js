import { verifyJwt } from "../modules/auth/actions.js"

export async function authMiddleware(req, res, next) {
    try {
        console.log("auth middlewurrrrrrrrr")
        const { authorization } = req.headers
        if (!authorization) {
            req.user = {}
            return next()
        }
        const payload = verifyJwt(authorization)
        req.user = payload
        next()
    } catch (err) {
        console.error(err)
        next()
    }
}