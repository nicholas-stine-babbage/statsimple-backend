import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import knex from '../../db.js'

export async function login(email, password) {
    try {
        // Get the user
        const user = await knex('users').first('*').where({ email: email.toLowerCase() })
        const { passhash, status, id } = user
        
        // Is the account active?
        const active = status == 'active'
        
        // Did they provide the correct password?
        const authed = await argon2.verify(passhash, password)
        if (!authed) return { authed: false }

        // All is well, give them a token and send them on their way :)
        const token = signJwt(user)
        return { authed, token, active, id }

    } catch (err) {
        // On failure, return active=true but authed=false for a 401 error
        console.error(err)
        return { authed: false }
    }
}

const supersecretnotsosecrettempkey = "657tguidhj92387grghyec"

function signJwt(payload) {
    return jwt.sign(payload, supersecretnotsosecrettempkey, { expiresIn: '14d' })
}

export function verifyJwt(token) {
    return jwt.verify(token, supersecretnotsosecrettempkey)
}

export function refreshJwt(token) {
    try {
        // verify and get contents
        const payload = verifyJwt(token)
        const { exp, ...new_payload } = payload

        // Valid? refresh it and return a new token with good good suck sesh object
        return { success: true, token: signJwt(new_payload)}
    } catch (error) {
        console.error(error)
        // Invalid? return no no suck sess object
        return { success: false }
    }    
}

