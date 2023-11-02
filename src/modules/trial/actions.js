import knex from '../../db.js'
import { v4 as uuid } from 'uuid'

export async function saveTrial(trial) {
    try {
        await knex('trials').insert({ id: uuid(), ...trial })
    } catch (err) {
        console.err(err)
    }
}

export async function getTrialsByUserId(user_id) {
    try {
        const trials = await knex('trials').select('*')
        // console.log("YOU HAPPA SMADA SHMACKA BOIIIIII", trials)
        return trials
    } catch (err) {
        console.error(err)
    }
}