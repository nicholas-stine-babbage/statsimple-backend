import knex from '../../db.js'
import jwt from 'jsonwebtoken'
import { validatePayload } from '../../email/links.js'
import { updateUser } from '../user/actions.js'
import { signJwt } from '../auth/actions.js'

export async function loading(payload) {
    const { action, redirect, data } = validatePayload(payload)
    let result = {}
    switch (action) {
        case 'verify-email':
            console.log("case: verify-email")
            await updateUser({ id: data.id, status: 'active' })
            const authorization = signJwt({ id: data.id, email: data.email, status: 'active' })
            result = { redirect, authorization }
            break

        case 'password-reset':
            console.log("case: password-reset")
            break

        case 'credit-purchase':
            console.log("case: credit-purchase")
            break

        case 'unsubscribe':
            console.log("case: unsubscribe, handled elsewhere, DEAL WITH IT >:)")
            break

        default:
            throw new Error("LOADING ACTION NOT PROVIDED")
    }

    return result
}