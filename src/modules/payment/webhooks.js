import { getUserFromCustomerId, savePaymentMethod, updateCustomer, endTrialPeriod } from './actions.js'
import { addCredits } from '../credits/actions.js'
import { updateUser, getUserFromEmail } from '../user/actions.js'
import PRICE_IDS from './price-ids.js'
import { usePromo } from '../promo/actions.js'
const PRICES = {
    [PRICE_IDS['bulk']]: 'credit', // bulk     - $4.00 per token
    [PRICE_IDS['flex']]: 'credit', // flex     - $6.00 per token
    [PRICE_IDS['single']]: 'credit', // single   - $7.00 per token
    'price_1OafeSLxGNM2wk1PfvplEcbr': 'subscription'
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
}

async function paymentSucceeded(body) {
    const { lines, customer, customer_email } = body.data.object
    let { quantity, price: { id: price_id }} = lines.data[0]

    const { quantity: promo_quantity, price: { metadata: { promo_code }}} = lines.data[1] || { quantity: 0, price: { metadata: {}}}
    quantity = quantity + promo_quantity
    console.log("promo_quantity:",promo_quantity)
    console.log("promo_code:",promo_code)

    switch(PRICES[price_id]) {
        case 'credit':
            console.log("Handling Credit Purchase")
            console.log("customer:", customer)
            console.log("quantity:", quantity)
            const credit_user = await getUserFromCustomerId(customer)
            await addCredits(credit_user.id, quantity)
            await endTrialPeriod(credit_user.id)
            await updateUser({ id: credit_user.id, status: 'active'}) 
            await usePromo(promo_code, credit_user.id)
            break
        case 'subscription':
            console.log("Handling Subscription Purchase")
            console.log("BODY: ", body.data.object)
            const subscription_user = await getUserFromCustomerId(customer) || await getUserFromEmail(customer_email)
            
            // give dat boi deir credits
            await addCredits(subscription_user.id, 40)
            // give dat boi deir customer id if dey aint got one
            await updateCustomer({ user_id: subscription_user.id, customer_id: customer })
            break
        default:
            console.error('FAILED TO HANDLE PAYMENT.SUCCEEDED EVENT - Unrecognized Price ID: ', price_id)
    }
}

async function intentSucceeded(body) {
    // try {
        const { customer, payment_method } = body.data.object
        await savePaymentMethod(customer, payment_method)
    // } catch (err) {
    //     throw err
    // }
}