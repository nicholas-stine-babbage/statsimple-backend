import knex from '../../db.js'
import argon2 from 'argon2'
import { v4 as uuid } from 'uuid'
import { createStripeUser, creditPurchase, startSubscription } from '../payment/actions.js'
import { signJwt } from '../auth/actions.js'
import { addCredits } from '../credits/actions.js'
import { sendEmail } from '../../email/send.js'
import { signPayload, validatePayload } from '../../email/links.js'

export async function createUser(email, password, name, business, checkout_type, preferred_price) {
    const id = uuid()
    try {
        const passhash = await argon2.hash(password)
        const { status } = await knex('users').insert({ id, email: email.toLowerCase(), passhash, name, business }).returning('id', 'status')
        
        // Setup customer
        const { customer_id } = await createStripeUser(id, email)
        const { sessionId } = checkout_type == 'subscription'
            ? await startSubscription(customer_id)
            : await creditPurchase(id, preferred_price == 'bulk' ? 25 : 10, 'calculator', preferred_price)

        // Add free trial credits
        await addCredits(id, 2, { rep_limit: 3, treat_limit: 6 })

        // Send validate email
        const url = `${process.env.CLIENT_URL}/loading?payload=${signPayload({ id, email }, 'verify-email', '/calculator')}`
        sendEmail('verify-email', { to: email, subject: 'Verify StatSimple Account' }, { url })

        // Sign auth token and return
        const authorization = signJwt({ id, email: email.toLowerCase(), status })
        return { sessionId, authorization, status }
    } catch (err) {
        console.error(err)
        await hardDeleteUser(id)
        throw err
    }
}

export async function reSendVerificationEmail(id, email) {
    console.log("reSendVerificationEmail(...)")
    // Send validate email
    const url = `${process.env.CLIENT_URL}/loading?payload=${signPayload({ id, email }, 'verify-email', '/calculator')}`
    console.log(url)
    return sendEmail('verify-email', { to: email, subject: "Verify StatSimple Account" }, { url })
}

export async function getUser(id) {
    try {
        console.log("getting user by id: ", id)
        return knex('users').first('id', 'name', 'business', 'email', 'status').where({ id })
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function getUserFromEmail(email) {
    try {
        console.log("getting user by email: ", email)
        return knex('users').first('id', 'name', 'business', 'email').where({ email })
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateUser(user) {
    try {
        const { id, ...updated } = user

        // If updating email, check for conflicts
        if (updated.email) {
            const old_user = await knex('users').first('*').where({ id })
            if (old_user.email != updated.email && await checkEmailExists(updated.email)) throw new Error('Email Already In Use')
        }
    
        console.log("updating user")
        return await knex('users').where({ id }).update(user)
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function hardDeleteUser(id) {
    try {
        const user_id = id
        await knex('stripe').where({user_id}).del()
        await knex('users').where({id}).del()
    } catch (err) {
        console.error(err)
        console.log('FAILED TO DELETE USER')
    }
}

async function checkEmailExists(email) {
    console.log('email')
    return !!(await knex('users').first('id').where({email}))
}

export async function unsubscribe(token, reason="deez faults") {
    const { data } = validatePayload(token)
    const email = data?.email
    if (!email) throw new Error("FALIED TO PARSE EMAIL FROM UNSUBSCRIBE TOKEN")
    console.log("unsubscribing: ", email)
    return knex('email_blacklist').insert({ email, reason }).onConflict('email').merge(['reason'])
}