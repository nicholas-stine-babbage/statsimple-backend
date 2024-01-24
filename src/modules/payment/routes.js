
import { Router } from 'express'
import { creditPurchase, getCustomerFromUserId, createPortalSesion, getSubscriptionStatus, startSubscription } from './actions.js'
import { webhook } from './webhooks.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()

async function creditPurchaseHandler(req, res, next) {
    try {
        const { quantity, redirect } = req.body
        const { customer_id } = await getCustomerFromUserId(req.user.id)
        const session = await creditPurchase(customer_id, quantity, redirect || 'calculator') // NEEDS CUSTOMER_ID AND QUAN TITTY
        res.json(session)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/purchase-credits', authMiddleware, creditPurchaseHandler)

async function getSubscriptionStatusHandler(req, res) {
    try {
        const { customer_id } = await getCustomerFromUserId(req.user.id)
        const active = await getSubscriptionStatus(customer_id)
        res.json({ active })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.get('/subscription-status', authMiddleware, getSubscriptionStatusHandler)

async function startSubscriptionHandler(req, res) {
    try {
        const { customer_id } = await getCustomerFromUserId(req.user.id) || {}
        const session = await startSubscription(customer_id, req.user.email, 'settings')
        res.json(session)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/start-subscription', authMiddleware, startSubscriptionHandler)

async function stripeWebhookHandler(req, res) {
    try {
        await webhook(req.body)
        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
        console.log("CAUGHT IN THE ROUTE HANDLERRRRRRRR")
    }
}
router.post('/webhooks', stripeWebhookHandler)

async function portalSessionHandler(req, res) {
    try {
        const portal_session = await createPortalSesion(req.user.id)
        res.json(portal_session)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/portal-session', authMiddleware, portalSessionHandler)

export default router