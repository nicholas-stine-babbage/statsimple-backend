
import { Router } from 'express'
import { creditPurchase, getCustomerFromUserId, createPortalSesion, getSubscriptionStatus, startSubscription } from './actions.js'
import { webhook } from './webhooks.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()

async function creditPurchaseHandler(req, res, next) {
    try {
        let { quantity, redirect, price } = req.body
        const { customer_id } = await getCustomerFromUserId(req.user.id)
        const session = await creditPurchase(customer_id, quantity, redirect || 'calculator', price) // NEEDS CUSTOMER_ID AND QUAN TITTY (apparently at some point I added it, but that comment ain't goin nowhere for SHEEEEEEIIIIIT)
        res.json(session)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/purchase-credits', authMiddleware, creditPurchaseHandler)
// I'm in starbucks sitting next to four strangers, and every single one of us was singing along to I WANT IT THAAAAT WAY, TEEEEELLL ME WHYEEEE, i NEVER WANT TO HEAR YOU SAAAAAYYYAAAY!

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