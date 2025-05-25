
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { validatePromoCode } from './actions.js'

const router = Router()

async function validatePromoCodeHandler(req, res) {
    try {
        const { promo_code } = req.query
        console.log("VALIDATING PROMO CODE", promo_code, req.user.id)
        const validation = await validatePromoCode(promo_code, req.user.id)
        res.json(validation)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.get('/validate', authMiddleware, validatePromoCodeHandler)

export default router