
import { Router } from 'express'
import { login, refreshJwt, startPasswordReset, completePasswordReset } from './actions.js'
import { getCustomerFromUserId, creditPurchase } from '../payment/actions.js'

const router = Router()

async function loginHandler(req, res, next) {
    try {
        const { email, password } = req.body
        const { authed, token, active, id } = await login(email, password)

        if (!authed) return res.sendStatus(401)
        // if (!active) {
        //     const { customer_id } = await getCustomerFromUserId(id) || {}
        //     const sessionId = await creditPurchase(customer_id, 10, `calculator?auth=${token}`)
        //     return res.json(sessionId)
        // }
        res.send({ token })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/login', loginHandler)

async function tokenKeepAliveHandler(req, res) {
    try {
        const { token: previous_token } = req.body
        const refreshed = refreshJwt(previous_token)
        if (!refreshed.success) return res.sendStatus(401)
        res.send({ token: refreshed.token })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/validate', tokenKeepAliveHandler)

async function startResetPasswordHandler(req, res) {
    try {
        const { email } = req.body
        const { authorization: token } = req.headers
        await startPasswordReset(email, token)
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/reset', startResetPasswordHandler)

async function completeResetPasswordHandler(req, res) {
    try {
        const { token, password, confirm_password } = req.body
        if (password != confirm_password) res.sendStatus(400)
        
        await completePasswordReset(password, token)
        res.sendStatus(201)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.put('/reset', completeResetPasswordHandler)

export default router