import { authMiddleware } from '../middleware/auth.js'
import authRouter from './auth/routes.js'
import userRouter from './user/routes.js'
import trialRouter from './trial/routes.js'

export async function loadModules(app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/trial', authMiddleware, trialRouter)
}