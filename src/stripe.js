import dotenv from './dotenv.js'
import Stripe from 'stripe'
export default Stripe(process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY)