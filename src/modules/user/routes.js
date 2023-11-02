
import { Router } from 'express'
import { createUser } from './actions.js'

const router = Router()

async function createUserHandler(req, res, next) {
    const { email, password, name, business } = req.body
    await createUser(email, password, name, business)
    res.sendStatus(201)
}

router.post('/', createUserHandler)


export default router