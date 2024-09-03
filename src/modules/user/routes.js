
import { Router } from 'express'
import { createUser, getUser, reSendVerificationEmail, updateUser, unsubscribe } from './actions.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()

async function createUserHandler(req, res, next) {
    try {
        const { email, password, name, business, checkout_type, preferred_price } = req.body
        const { sessionId, authorization, status } = await createUser(email, password, name, business, checkout_type, preferred_price)
        res.json({ sessionId, authorization, status })
    } catch (err) {
        if (err?.constraint == 'users_email_key') return res.sendStatus(409)
        res.sendStatus(500)
    }
}

router.post('/', createUserHandler)

async function getUserHandler(req, res, next) {
    try {
        console.log("WHERE'S THE PIZZA")
        const user = await getUser(req.user.id)
        console.log(user)
        res.json(user)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.get('/', authMiddleware, getUserHandler)


async function updateUserHandler(req, res, next) {
    try {
        console.log("WHERE'S THE PIZZA")
        await updateUser(req.body)
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        if (err?.message == 'Email Already In Use') res.status(409).send(err)
        res.sendStatus(500)
    }
}
router.put('/', authMiddleware, updateUserHandler)

async function reSendVerificationEmailHandler(req, res, next) {
    try {
        const { id, email } = req.user
        await reSendVerificationEmail(id, email)
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}

router.put('/resend-verification', authMiddleware, reSendVerificationEmailHandler)

async function unsubscribeHandler(req, res, next) {
    try {
        console.log("sun ub cribing in dis bio tch")
        const { token, reason } = req.body
        if (!token) return res.sendStatus(400)
        await unsubscribe(token, reason)
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.put('/unsubscribe', unsubscribeHandler)

export default router