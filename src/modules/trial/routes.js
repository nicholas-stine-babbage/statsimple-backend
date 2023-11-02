
import { Router } from 'express'
import { saveTrial, getTrialsByUserId } from './actions.js'

const router = Router()

async function saveTrialHandler(req, res, next) {
    // const { data, headers } = req.body
    await saveTrial(req.body)
    res.sendStatus(201)
}
router.post('/', saveTrialHandler)

async function getTrialsByUserHandler(req, res, next) {
    console.log("WELL LOOKIE DERE!", req.user)
    const trials = await getTrialsByUserId(req.params.user_id)
    res.send(trials)
}
router.get('/:user_id', getTrialsByUserHandler)

export default router