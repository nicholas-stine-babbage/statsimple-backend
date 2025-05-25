import { addCredits } from "./actions.js";
import { v4 as uuid } from "uuid";
import knex from '../../db.js'

async function addUserCredits(email, quantity) {
    const user = await knex('users').first(['id', 'email']).where({ email })
    if (!user) throw new Error('ERR_USER_NOT_FOUND')
    await addCredits(user.id, quantity)
}

addUserCredits('stevesdeitz@gmail.com', 15)
.then(() => {
    console.log('done')
    process.exit(0)
})
.catch((err) => {
    console.error(err)
    process.exit(0)
})

async function youGetACreditYOUgetAcREdIt(quantitties, email_list) {
    const users = await knex('users')
        .select('id as user_id')
        .whereIn('email', email_list)
    console.log(users.length)
    let credits = []
    // const iter = new Array(quantitties).keys()
    for (const { user_id } of users) {
        for (let i = 0; i < quantitties; i++) {
            credits.push({
                id: uuid(),
                user_id,
                status: 'active'
            })
        }
    }

    // console.log(credits.map(cred => JSON.stringify(cred)))
    console.log(credits.length)
    await knex('credits').insert(credits)
}

// const EMAIL_LIST = [
//     'con1234@mail.com',
//     'nork@bork.com',
//     'grechnm@gmail.com',
//     'helen.huyton@dysonfarming.com',
//     'gesine.dreier@helmag.com',
//     'johann-christian.niendorf@helmag.com',
//     'stevesdeitz@gmail.com',
//     'connorlilles@gmail.com',
//     'destjmcedano@gmail.com',
//     'test@example.com',
//     'w.j.haywood@icloud.com',
//     'wj.haywood@virgin.net',
//     'nickstine1450@gmail.com',
//     'con9999999@gmail.com',
// ]

// youGetACreditYOUgetAcREdIt(10, EMAIL_LIST)
//     .then(() => {
//         console.log("DONE")
//         process.exit(0)
//     })
//     .catch((err) => {
//         console.error(err)
//         process.exit(0)
//     })