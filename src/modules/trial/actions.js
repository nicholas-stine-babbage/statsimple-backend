import knex from '../../db.js'
import { v4 as uuid } from 'uuid'
import fs from 'fs'

export async function saveTrial(trial, user_id) {
    try {
        const id = uuid()
        await knex('trials').insert({ id, user_id, ...trial }).onConflict('id').merge(['data', 'headers'])
        return id
    } catch (err) {
        console.error(err)
    }
}

export async function saveTrialAsCsv(data, headers, user_id) {
    return new Promise((resolve, reject) => {
        try {
            const parsed_headers = typeof headers == 'string'
                ? JSON.parse(headers)
                : headers
            const parsed_data = typeof data == 'string'
                ? JSON.parse(data)
                : data

            console.log(data)
            
            const reps = Object.keys(parsed_data[1])
            const treatments = Object.keys(parsed_data)
            const header_string = Object.keys(parsed_headers).map((_, i) => parsed_headers[i+1]).join(',')
            const data_string = reps.map((_, i) => treatments.map((_, j) => parsed_data[j+1][i+1]).join(',')).join('\n')
            const csv_string = `${header_string}\n${data_string}`
            console.log(csv_string)
            const filename = `/tmp/${Date.now()}_trial.csv`
            fs.writeFile(filename, csv_string, 'utf8', (err) => {
                console.log("inside scope")
                if (err) reject(err)
                else resolve(filename)
                
            })
            console.log("outside scope")
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}

export async function getTrialsByUserId(user_id) {
    try {
        const trials = await knex('trials').select('*').where({ status: 'active', user_id })
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