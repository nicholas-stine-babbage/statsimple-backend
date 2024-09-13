import nodemailer from 'nodemailer'
import { getTemplate } from './templates.js'

const transpo = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: 'noreply@stat-simple.com',
        serviceClient: '113070376769379625400',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmVQ4DNiDZZ2uo\nOr7Fa+ZhRFKrvVMvx3pLu3VfmkKihrDnHgQw5L8YGYMXel/AhDw3KkudFlAYIKHj\n6oTFeRBSACOUzpW+JK2H9qv60gYm/NaowiV1XlYtgiTHGs6B/040fMVva8rsrAUe\nyoHS03UvzS5GQFTmD0tj4e2Khn+eTb+AnrcU4FSCnhH8iyixkkrf2cQ58XbINWIB\nXT9haIoNracSusv4StxfjfwU9XdxVIG04CFaMzydruHaBteQzxTUiNJrKNDCog6W\nb+zLRuwyoLZzf4HLgWjuUsvsc1ADrgnbEHTV5/lKqZC5aLTQEiS5FYbhcYChYkXm\nFVE4quc1AgMBAAECggEACC3nED/dait0hxOKdY1aiR5xvUnEWTVjPW2ktjSRAcqD\nUP4wIRJilkYM5P7qzf4CswjEqp8iBam3JEzQRiCvrYSdu0/UW8MUeHroFp+01z54\nNNjFPEoNDVRYyCS4knpyR1D6aYIAutYzs0GslCg7W0Qo+iHoOt72K119D6KRDID8\nXJMF8lU0k54xkUy7RXXjFGUY+9MQMv6V+Xi+cGNzwwGQ85xjtxB0KyzJcXSdq+2X\nvdfbQ2Bg9wHoai7vFazdwl/2idqIlUVF2CBo786ZtymFHOnI0FiWO94XDn6PRC+g\nkrKONI1u3OEvdcSM8OKYwyRQTFZC2k/cr37Cuau08QKBgQDj16oESPWjNEGOhHsV\nCFbVw1WA0MSPneudaYGsSqkt3FobKzCV1JbqQsJITnIc70qjGjyqqmjWPG9QMfWm\nojgK4CGG1bKaM+htrHSI1FP1myv3SjCikSMW9LC3K8v6YTX8BukglckADcPgCYIV\ne+dE1k6aXcF9waWFgWm6wBdqpQKBgQC6416p1PDBuThV/ipdPhnpqQYHzQWUpbAk\ngbe3da5om5WuAgEj0D4lBS/mg+v6w96QWHYO05CflRHwiOGHTyW/4cxIwjKtpYO+\nEyEOwMqHZq8XBaZaFYnI6ceo88LReX0jHIdfwpAERj805BbIhWT9Vl6C0FZ+En/O\nFlnzVhY1UQKBgQCUe7oLLNkYUTff/yqPXG3qxW/1kRhoWAxy+41MkSOMBaybRBxX\nqMHpTTR8FtN7U98aSED9IC1OYPhSFRz4SYOoYsS2sJHCuM1inB8eBPHqgAO5Fxp2\n94scrL51wQ8fzzZ1VrObTsI9TLs4SDoEckkXrWpwY2Vz5T1PsjULRaB9GQKBgDSO\nSEq+RU5VRhB4v3UlR6g8DiQXdeBNj/FUQVPoVjm4tykOC0AFCdTjVosewjfs6SPy\nnJCi0mLuSvM3qySgD1+cohQ7+IB4sUm8m2lIsivNpqN0xUlEEVFc3PcYRcsevSAo\nn7FAR7vL/W5kTjvpt3K+3SkwaYJetW5BPt59cRVhAoGAIut0Oz5LFNEem3nTFjAP\nFYc+fMe64YGzTPQROxQLygK2UQUE1Wx+w/LqngONyLHOdc8UywL173JKjH6zua1m\nq42jPvzMX18J6dEhgwv0/erQI0jO1zpdSHbqQ7/e4V2z2WRbCynMy38oj8SrkjS/\nwOk2hahFxkOywj9snrcz9k0=\n-----END PRIVATE KEY-----\n',
        accessUrl: 'https://oauth2.googleapis.com/token',
    }
})

export async function sendEmail(template, details, content) {
    // const verified = await transpo.verify()
    // console.log("verified:", verified)

    const html = getTemplate(template, details, content)

    return transpo.sendMail({
        to: details.to,
        subject: details.subject || 'StatSimple.com',
        html
    })
}

// sendEmail('verify-email', { to: 'nickstine1450@gmail.com', subject: 'override subject'}, { url: 'https://google.com' }) 