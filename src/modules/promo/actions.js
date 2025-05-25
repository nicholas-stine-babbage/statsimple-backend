import { v4 as uuid } from 'uuid'
import knex from '../../db.js'
import { signJwt, verifyJwt } from '../auth/actions.js'

const PROMO_CODES = ['STAT2025']

export async function validatePromoCode(promo_code, user_id) {
    const valid = PROMO_CODES.includes(promo_code)
    if (!valid || !promo_code) return { invalid: true }

    const used = await knex('promos')
        .select('*')
        .where('user_id', user_id)
        .andWhere('code', promo_code)
        .first()
    
    console.log(used)
    return { used: !!used }
}

export async function usePromo(promo_code, user_id) {
    const valid = PROMO_CODES.includes(promo_code)
    if (!promo_code || !user_id || !valid) return 

    return knex('promos')
        .insert({ user_id, code: promo_code })
}