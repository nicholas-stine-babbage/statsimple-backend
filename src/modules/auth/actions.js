import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import knex from '../../db.js'

export async function login(email, password) {
    try {
        const user = await knex('users').first('*').where({email})
        const { passhash } = user
        const authed = await argon2.verify(passhash, password)
        if (!authed) return { authed: false }
        const token = signJwt(user)
        return { authed, token }
    } catch (err) {
        console.error(err)
        return { authed: false }
    }
}

const supersecretnotsosecrettempkey = "657tguidhj92387grghyec"

function signJwt(payload) {
    return jwt.sign(payload, supersecretnotsosecrettempkey, { expiresIn: '1d' })
}

export function verifyJwt(token) {
    return jwt.verify(token, supersecretnotsosecrettempkey)
}