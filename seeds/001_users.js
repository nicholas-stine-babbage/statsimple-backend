export async function seed(knex) {
    await knex('users').del()
    await knex('users').insert([
        {
        id: 'be1b4a6d-e6e4-46f2-93fb-1e48145de462',
        name: 'Nicholas Stine',
        email: 'nickstine1450@gmail.com',
        passhash: '$argon2id$v=19$m=65536,t=3,p=4$FADqMcb3CyakPXAcN0OFjA$EfusbCk3DAah3D08PDtuVdKJax75VxcfzJW+gVuA2aY'
    }, 
    {
        id: '596a22c6-7cc6-4dfb-910d-8309ba833d1c',
        name: 'John Haywood',
        email: 'w.j.haywood@icloud.com',
        passhash: '$argon2id$v=19$m=65536,t=3,p=4$zBeyuWxhJ6pkNmlnOyA8Gg$CeKkjG6LA2FRGG3HLL96xE2QSZ8F2/1BoJLEwohUb6w'
    }, 
    {
        id: 'a9ba9aa8-90b4-4b4e-893f-0583e8997574',
        name: 'Nork Bork',
        email: 'nork@bork.com',
        passhash: '$argon2id$v=19$m=65536,t=3,p=4$Jzp+hdG3mXF4/opfrjG6hw$IIBXnw1GydUW4U2CFj4BI00pT+QxtXxQh1Do8WTKjlQ'
    }, 
    {
        id: '52fd868e-2640-4920-8793-35c0589f95df',
        name: 'Connor Lilles',
        email: 'connorlilles@gmail.com',
        passhash: '$argon2id$v=19$m=65536,t=3,p=4$GBLx7dxBBxp03Q62hDj+sA$sR1W2rgQsxS2bW1EbzsVeUuZB2ayJRpp+5tK9MJd2Ns'
    }
])
}