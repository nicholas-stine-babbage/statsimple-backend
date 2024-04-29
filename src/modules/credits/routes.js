
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { getUserCredits } from './actions.js'

const router = Router()

async function getUserCreditsHandler(req, res) {
    try {
        const quantity = await getUserCredits(req.user.id)
        console.log("QUANTITTIES: ", quantity)
        res.json(quantity)
    } catch (err) {
        res.sendStatus(500)
    }
}
router.get('/user', authMiddleware, getUserCreditsHandler)

export default router