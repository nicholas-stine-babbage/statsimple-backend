export function getTemplate(template, content) {
    const html = {
        'verify-email': verifyEmail(content),
        'password-reset': resetPassword(content)
    }[template || '']

    if (!html) throw new Error('EMAIL TEMPLATE NOT FOUND')
    return html
}

function verifyEmail({ url }) {
    return `
        <html>
            ${head}
            <body>
                <div class="page">
                    <div class="page-content">
                        <p>
                            <h1>Stat Simple Email Verification</h1>
                        </p>
                        <p>
                            <a href="${url}">Click here to verify your email</a>
                        </p>
                    </div>
                    ${footer}
                </div>
            </body>
        <html>
    ` 
}

function resetPassword({ url }) {
    return `
        <html>
            ${head}
            <body>
                <div class="page">
                    <div class="page-content">
                        <p>
                            <h1>Stat Simple Password Reset</h1>
                        </p>
                        <p>
                            <a href="${url}">Click here to reset your password</a>
                        </p>
                    </div>
                    ${footer}
                </div>
            </body>
        <html>
    ` 
}

const head = `
<head>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        footer {
            background: #eee;
            padding: 2rem;
            border-bottom-left-radius: 2rem;
            border-bottom-right-radius: 2rem;
        }
        
        .footer-content {
            display: flex;
            height: 10vh;
        }
        
        .footer-content b {
            font-size: 1.5rem;
        }
        
        .footer-content a {
            margin-right: 2rem;
        }

        .footer-logo {
            height: 5.5rem;
            width: auto;
        }

        .footer-link-group {
            display: flex;
        }

        .page {
            border-radius: 1rem;
            background: #f6f6f6;
            margin-left: 10vw;
            margin-right: 10vw;
        }

        .page-content {
            padding: 3rem;
            padding-top: 2rem;
        }
    </style>
</head>
`

const footer = `
<footer>
    <div class="footer-content">
        <img class="footer-logo" src="https://stat-simple.com/icons/stat-simple-logo.png" />
        <div>
            <b>Stat Simple</b>
            <p>Keeping statistics easy and simple.</p>
            <div class="footer-link-group">
                <a href="https://google.com">StatSimple.com</a>
                <a href="https://google.com">Unsubscribe</a>
            </div>
        </div>
    </div>
</footer>
`