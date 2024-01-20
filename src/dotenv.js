import dotenv from 'dotenv'
export default dotenv.config({ path: process.env.PRODUCTION ? '.production.env' : '.development.env' })