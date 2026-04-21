
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { getUserCredits, useUserCredit } from './actions.js'

const router = Router()

async function getUserCreditsHandler(req, res) {
    try {
        if (req.user.role === 'unlimited') return res.json({ quantity: 0, unlimited: true })
        const quantity = await getUserCredits(req.user.id)
        console.log("QUANTITTIES: ", quantity)
        res.json(quantity)
    } catch (err) {
        res.sendStatus(500)
    }
}
router.get('/user', authMiddleware, getUserCreditsHandler)

async function useUserCreditsHandler(req, res) {
    try {
        if (req.user.role === 'unlimited') return res.json({ quantity: 0, unlimited: true })
        const quantity = await useUserCredit(req.user.id)
        res.json(quantity)
    } catch (err) {
        if (err?.message == 'ERR_NO_CREDITS') return res.sendStatus(402)
        res.sendStatus(500)
    }
}
router.put('/user', authMiddleware, useUserCreditsHandler)

export default router