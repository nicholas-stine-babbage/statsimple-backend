import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import knex from '../../db.js'
import { sendEmail } from '../../email/index.js'
import { getUserFromEmail } from '../user/actions.js'

const supersecretnotsosecrettempkey = "657tguidhj92387grghyec"

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

        const token = signJwt({id: user.id, email: user.email, status: user.status })
        return { authed, token, active, id }

    } catch (err) {
        // On failure, return active=true but authed=false for a 401 error
        console.error(err)
        return { authed: false }
    }
}

export async function startPasswordReset(email, token) {
    console.log("0: EMAIL", email)
    // Verify and collect user info
    if (!email && !token) throw new Error("PASSWORD RESET FAILED, NO TOKEN OR EMAIL PROVIDED")
    const { email: payload_email } = email
        ? { email }
        : verifyJwt(token)
    console.log("1: payload_email", payload_email)
    const { id: user_id } = await getUserFromEmail(payload_email)
    
    // Sign and save token
    const reset_token = signJwt({ email: payload_email, created_at: Date.now() })
    await knex('password_reset').insert({ user_id, token: reset_token }).onConflict('user_id').merge('token')

    // Email reset link
    const url = `${process.env.CLIENT_URL}/reset?token=${reset_token}`
    await sendEmail(payload_email, url)
}

export async function completePasswordReset(password, token) {
    // Verify token valid
    if (!token) throw new Error("COMPLETE PASSWORD RESET FAILED, NO TOKEN PROVIDED")
    const { created_at, email } = verifyJwt(token)
    if (Date.now() - created_at > 8.64e+7) throw new Error("COMPLETE PASSWORD RESET FAILED, TOKEN EXPIRED")
    
    // Verify & delete token
    const { id: user_id } = await getUserFromEmail(email)
    const { user_id: saved_id, token: saved_token } = await knex('password_reset').first('*').where({ user_id })
    if (user_id != saved_id || token != saved_token) throw new Error("COMPLETE PASSWORD RESET FAILED, PROVIDED AND SAVED INFO MISMATCHED")
    await knex('password_reset').del().where({ user_id })

    // Update
    const passhash = await argon2.hash(password)
    await knex('users').update({ passhash }).where({ id: user_id })
}

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

