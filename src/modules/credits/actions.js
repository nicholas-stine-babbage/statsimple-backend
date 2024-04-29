import knex from '../../db.js'

export async function addCredits(user_id, quantity) {
    console.log("INSERTING INTO CREDITS TABLE: ", quantity, user_id)
    await knex.raw(`
        INSERT INTO credits (user_id, quantity)
        VALUES ('${user_id}', ${quantity})
        ON CONFLICT (user_id)
        DO UPDATE SET quantity = credits.quantity + ${quantity}
    `)
    // await knex('credits').insert({ user_id, quantity }).onConflict('user_id').merge(`credits.quantity + ${quantity}`)
}

export async function getUserCredits(user_id) {
    return knex('credits').first('quantity').where({ user_id })
}