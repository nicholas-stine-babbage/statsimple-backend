
import { Router } from 'express'
import { login, refreshJwt } from './actions.js'

const router = Router()

async function loginHandler(req, res, next) {
    const { email, password } = req.body
    const { authed, token } = await login(email, password)
    if (!authed) return res.sendStatus(401)
    res.send({ token })
}

router.post('/login', loginHandler)

async function tokenKeepAliveHandler(req, res) {
    const { token: previous_token } = req.body
    const refreshed = refreshJwt(previous_token)
    if (!refreshed.success) return res.sendStatus(401)
    res.send({ token: refreshed.token })
}

router.post('/validate', tokenKeepAliveHandler)

export default router