import knex from '../../db.js'
import { v4 as uuid } from 'uuid'

export async function saveTrial(trial) {
    try {
        const id = uuid()
        await knex('trials').insert({ id, ...trial }).onConflict('id').merge(['data', 'headers'])
        return id
    } catch (err) {
        console.error(err)
    }
}

export async function getTrialsByUserId(user_id) {
    try {
        const trials = await knex('trials').select('*').where({ status: 'active' })
        // console.log("YOU HAPPA SMADA SHMACKA BOIIIIII", trials)
        return trials
    } catch (err) {
        console.error(err)
    }
}

export async function softDeleteTrial(id) {
    try {
        await knex('trials').update({ status: 'inactive' }).where({ id })
    } catch (err) {
        console.error(err)
    }
}