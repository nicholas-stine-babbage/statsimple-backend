
import { Router } from 'express'
import { loading } from './actions.js'

const router = Router()

async function loadingHandler(req, res) {
    try {
        const { payload } = req.body
        const result = await loading(payload)
        if (!result) return res.sendStatus(500)
        res.json(result)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
}
router.post('/', loadingHandler)

export default router