import { authMiddleware } from '../middleware/auth.js'
import authRouter from './auth/routes.js'
import userRouter from './user/routes.js'
import trialRouter from './trial/routes.js'
import paymentRoutes from './payment/routes.js'
import creditRoutes from './credits/routes.js'

export async function loadModules(app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/payment', paymentRoutes)
    app.use('/trial', authMiddleware, trialRouter)
    app.use('/credits', creditRoutes)
}