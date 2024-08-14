import { v4 as uuid } from 'uuid'
import knex from '../../db.js'

export async function addCredits(user_id, quantity) {
    console.log("INSERTING INTO CREDITS TABLE: ", quantity, user_id)
    let new_ids = []
    for (let i = 0; i < quantity; i++) new_ids.push(uuid())
    const status = 'active'
    const new_credits = new_ids.map((id) => ({ id, user_id, token: '', status }))
    await knex('credits').insert(new_credits)
    // await knex.raw(`
    //     INSERT INTO credits (user_id, quantity)
    //     VALUES ('${user_id}', ${quantity})
    //     ON CONFLICT (user_id)
    //     DO UPDATE SET quantity = credits.quantity + ${quantity}
    // `)
    // await knex('credits').insert({ user_id, quantity }).onConflict('user_id').merge(`credits.quantity + ${quantity}`)
}

export async function getUserCredits(user_id) {
    const tokens = await knex('credits').where({ user_id, status: 'active' })
    return { quantity: tokens?.length }
    // return knex('credits').first('quantity').where({ user_id })
}

export async function useUserCredit(user_id) {
    const old_token = await knex('credits').first('id').where({ user_id, status: 'active' })
    if (!old_token) throw new Error("ERR_NO_CREDITS")
    const updated = await knex('credits').update({ status: 'used' }).where({id: old_token.id}).returning('id')
    if (!updated) throw new Error("ERR_CREDIT_UPDATE_FAILED")
    return getUserCredits(user_id)
    // console.log('old_token: ', old_token)
    // const { quantity: old_quantity } = await knex('credits').first('quantity').where({ user_id })
    // console.log("old_quantity", old_quantity)
    // if (!old_quantity || old_quantity < 0) throw new Error('ERR_NO_CREDITS')
    // const new_quantities = await knex('credits').update({ quantity: old_quantity - 1 }).where({ user_id }).returning('quantity')
    // if (!new_quantities) throw new Error('ERR_CREDIT_UPDATE_FAILED')
    // return new_quantities[0]
}