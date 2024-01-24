
import { Router } from 'express'
import { saveTrial, getTrialsByUserId, softDeleteTrial, saveTrialAsCsv } from './actions.js'

const router = Router()

async function saveTrialHandler(req, res, next) {
    const { data, headers } = req.body
    const filepath = await saveTrialAsCsv(data, headers, req.user.id)
    console.log("res.download")
    res.download(filepath)
    // const id = await saveTrial(req.body, req.user.id)
    // res.send({ id })
}
router.post('/', saveTrialHandler)


async function updateTrialHandler(req, res, next) {
    const { id } = req.params
    await saveTrial({ ...req.body, id })
    res.sendStatus(201)
}
router.put('/:id', updateTrialHandler)

async function getTrialsByUserHandler(req, res, next) {
    const trials = await getTrialsByUserId(req.user.id)
    res.send(trials)
}
router.get('/', getTrialsByUserHandler)

async function softDeleteTrialHandler(req, res) {
    await softDeleteTrial(req.params.id)
    return res.sendStatus(204)
}
router.delete('/:id', softDeleteTrialHandler)

export default router