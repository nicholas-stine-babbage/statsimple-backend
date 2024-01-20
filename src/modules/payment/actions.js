import knex from '../../db.js'
import stripe from '../../stripe.js'
import dotenv from '../../dotenv.js'

export async function creditPurchase(customer, quantity, redirect_path='login') {
    console.log("customer: ", customer)
    console.log("quantity: ", quantity)
    console.log("redirect_path: ", redirect_path)
    const { id: sessionId } = await stripe.checkout.sessions.create({
        customer,
        mode: 'payment',
        invoice_creation: { enabled: true },
        line_items: [{
            quantity,
            price: 'price_1OY809LxGNM2wk1PUDdFHVwP'
        }],
        success_url: `${process.env.CLIENT_URL}/${redirect_path}`
    })
    return { sessionId }
}

export async function createStripeUser(user_id, email) {
    const { id: customer_id } = await stripe.customers.create({ email })
    await knex('stripe').insert({ user_id, customer_id })
    return { customer_id }
}

export async function savePaymentMethod(customer, payment_method) {
    try {
        console.log("customer :", customer)
        console.log("payment_method :", payment_method)
        await stripe.paymentMethods.attach(payment_method, { customer })
    } catch (err) {
        console.error(err)
        if (err.rawType != 'invalid_request_error') throw err
    }
}

export async function createPortalSesion(user_id) {
    const { customer_id: customer } = await getCustomerFromUserId(user_id)
    return stripe.billingPortal.sessions.create({ customer, return_url: `${process.env.CLIENT_URL}/settings#purchases`})
}

export async function getUserFromCustomerId(customer_id) {
    return knex('users').first('users.*').join('stripe', 'users.id', 'stripe.user_id').where({ customer_id })
}

export async function getCustomerFromUserId(user_id) {
    return knex('stripe').first("customer_id").where({ user_id })
}