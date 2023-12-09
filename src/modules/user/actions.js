import knex from '../../db.js'
import argon2 from 'argon2'
import { v4 as uuid } from 'uuid'

export async function createUser(email, password, name, business) {
    try {
        const passhash = await argon2.hash(password)
        await knex('users').insert({ id: uuid(), email: email.toLowerCase(), passhash, name, business })
    } catch (err) {
        console.error(err)
    }
}