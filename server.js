import express from 'express'
import cors from 'cors'
import { loadModules } from './src/modules/loader.js'
import { authMiddleware } from './src/middleware/auth.js'

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())
// app.use(authMiddleware)

app.get('/', (req, res) => {
    res.send([])
})

loadModules(app)

app.listen(port, () => console.log(`AGSTAT SERVER LISTENING ON ${port}`))