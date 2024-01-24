
import { Router } from 'express'
import { createUser, getUser, updateUser } from './actions.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()

async function createUserHandler(req, res, next) {
    try {
        const { email, password, name, business, checkout_type } = req.body
        const session = await createUser(email, password, name, business, checkout_type)
        res.json(session)
    } catch (err) {
        res.sendStatus(500)
    }
}

router.post('/', createUserHandler)

async function getUserHandler(req, res, next) {
    try {
        console.log("WHERE'S THE PIZZA")
        const user = await getUser(req.user.id)
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
        res.status(500)
    }
}
router.put('/', authMiddleware, updateUserHandler)


export default router