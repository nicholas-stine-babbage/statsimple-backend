import knex from '../../db.js'
import argon2 from 'argon2'
import { v4 as uuid } from 'uuid'
import { createStripeUser, creditPurchase, startSubscription } from '../payment/actions.js'
import { signJwt } from '../auth/actions.js'

export async function createUser(email, password, name, business,  checkout_type) {
    const id = uuid()
    try {
        const passhash = await argon2.hash(password)
        await knex('users').insert({ id, email: email.toLowerCase(), passhash, name, business })
        const { customer_id } = await createStripeUser(id, email)
        const { sessionId } = checkout_type == 'subscription'
            ? await startSubscription(customer_id)
            : await creditPurchase(customer_id, 10, 'calculator')
        const authorization = signJwt({ id, email: email.toLowerCase(), status: 'active' })
        return { sessionId, authorization }
    } catch (err) {
        console.error(err)
        await hardDeleteUser(id)
        throw err
    }
}

export async function getUser(id) {
    try {
        console.log("getting user by id: ", id)
        return await knex('users').first('id', 'name', 'business', 'email').where({ id })
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
