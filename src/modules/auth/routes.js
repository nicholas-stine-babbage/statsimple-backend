
import { Router } from 'express'
import { login } from './actions.js'

const router = Router()

async function loginHandler(req, res, next) {
    const { email, password } = req.body
    const { authed, token } = await login(email, password)
    if (!authed) return res.sendStatus(401)
    res.send({ token })
}

router.post('/login', loginHandler)


export default router