import knex from '../../db.js'
import stripe from '../../stripe.js'
import dotenv from '../../dotenv.js'
import PRICE_IDS from './price-ids.js'
import { signPayload } from '../../email/links.js'
import { validatePromoCode } from '../promo/actions.js'

export async function startSubscription(customer, customer_email, redirect_path='login') {
    const { id: sessionId } = await stripe.checkout.sessions.create({
        customer,
        customer_email: customer ? undefined : customer_email,
        mode: 'subscription',
        line_items: [{
            quantity: 1,
            price: 'price_1OafeSLxGNM2wk1PfvplEcbr'
        }],
        success_url: `${process.env.CLIENT_URL}/${redirect_path}`
    })
    return { sessionId }
}

export async function getSubscriptionStatus(customer) {
    const subscriptions = await stripe.subscriptions.list({
        customer
    })
    console.log(subscriptions?.data[0]?.cancellation_details)
    const subscription_price = subscriptions?.data[0]?.items?.data[0]?.price.id
    return subscription_price == 'price_1OafeSLxGNM2wk1PfvplEcbr'
}

export async function creditPurchase(user_id, quantity, redirect_path='login', preferred_price='single', promo_code=null) {
    const { customer_id: customer } = await getCustomerFromUserId(user_id)
    console.log("customer: ", customer)
    console.log("quantity: ", quantity)
    console.log("redirect_path: ", redirect_path)
    console.log("promo_code: ", promo_code)
    const price = PRICE_IDS[preferred_price]

    // TODO: create a loading token and include in success URL
    const success_url = `${process.env.CLIENT_URL}/loading?payload=${signPayload({quantity}, 'credit-purchase', '/calculator')}`
    const { invalid, used } = await validatePromoCode(promo_code, user_id)
    let line_items = [{ quantity, price }]
    if (!invalid && !used) line_items.push({ quantity: 1, price: PRICE_IDS['promo'] })
    const { id: sessionId } = await stripe.checkout.sessions.create({
        customer,
        mode: 'payment',
        invoice_creation: { enabled: true },
        line_items,
        success_url
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

export async function endTrialPeriod(user_id) {
    return knex('credits').update({ token: '' }).where({ user_id, status: 'active' }).andWhereNot({ token: '' })
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

export async function updateCustomer(customer_object) {
    return await knex('stripe').insert(customer_object).onConflict('user_id').ignore()
}