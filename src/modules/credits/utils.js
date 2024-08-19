import { addCredits } from "./actions.js";
import { v4 as uuid } from "uuid";
import knex from '../../db.js'

async function addUserCredits(email, quantity) {
    const user = await knex('users').first(['id', 'email']).where({ email })
    if (!user) throw new Error('ERR_USER_NOT_FOUND')
    await addCredits(user.id, quantity)
}

addUserCredits('mr@king.com', 10)
.then(() => {
    console.log('done')
    process.exit(0)
})
.catch((err) => {
    console.error(err)
    process.exit(0)
})

// async function youGetACreditYOUgetAcREdIt(quantitties) {
//     const users = await knex('users').select('id as user_id')
//     console.log(users.length)
//     let credits = []
//     // const iter = new Array(quantitties).keys()
//     for (const { user_id } of users) {
//         for (let i = 0; i < quantitties; i++) {
//             credits.push({
//                 id: uuid(),
//                 user_id,
//                 status: 'active'
//             })
//         }
//     }

//     // console.log(credits.map(cred => JSON.stringify(cred)))
//     console.log(credits.length)
//     await knex('credits').insert(credits)
// }

// youGetACreditYOUgetAcREdIt(10)
// .then(() => {
//     console.log("DONE")
//     process.exit(0)
// })
// .catch((err) => {
//     console.error(err)
//     process.exit(0)
// })