import stripe from '../../stripe.js'
import { getUserFromCustomerId, savePaymentMethod } from './actions.js'
import { addCredits } from '../credits/actions.js'
import { updateUser } from '../user/actions.js'

const PRICES = {
    'price_1OY809LxGNM2wk1PUDdFHVwP': 'credit'
}

export async function webhook(body) {
    // try {
    console.log("STRIPE WEBHOOK RECEIVED: ", body.type)
    switch (body.type) {
        case 'payment_intent.succeeded':
            await intentSucceeded(body)
            break
        case 'invoice.payment_succeeded':
            await paymentSucceeded(body)
            break
        }
    // } catch (err) {
    //     console.log("CAUGHT IN WEBHOOK FUNCTION")
    //     throw err
    // }
}

async function paymentSucceeded(body) {
    const { lines, customer } = body.data.object
    const { quantity, price: { id: price_id }} = lines.data[0]
    if (PRICES[price_id] != 'credit') return console.error('FAILED TO UPDATE TOKENS: Unrecognized Price ID: ', price_id)
    
    console.log("customer:", customer)
    const user = await getUserFromCustomerId(customer)
    console.log("user:", user)
    const { id: user_id } = user
    await addCredits(user_id, quantity)
    await updateUser({ id: user_id, status: 'active'}) 
}

async function intentSucceeded(body) {
    // try {
        const { customer, payment_method } = body.data.object
        await savePaymentMethod(customer, payment_method)
    // } catch (err) {
    //     throw err
    // }
}