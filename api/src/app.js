const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session');
const dotenv = require('dotenv');
const pool = require('./database.js')
const { signinHandler, signupHandler, confirmEmailHandler, sendConfirmationHandler, logoutHandler, verifyQRHandler, resetQRHandler, twoFactorAuthHandler } = require('./handlers/user');
const isAuthenticated = require('./middlewares/isAuthenticated.js');

dotenv.config();

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(cors())

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    store: new (require('connect-pg-simple')(session))({pool}),
    secret: process.env.SESSION_SECRET,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 30 * 60 * 1000, // 30 minutes
        sameSite: 'none',
        secure: true,
        domain: '.app.localhost'
    },  
    saveUninitialized: false,
}));

app.get('/', (req,res)=>{
    res.send({data: 'gfgfgfgfgf'})
})

app.post('/signin', signinHandler)
app.post('/signup', signupHandler)
app.post('/twofactorauth', isAuthenticated, twoFactorAuthHandler)
app.get('/confirm/:token', confirmEmailHandler)
app.post('/sendconfirmation', isAuthenticated, sendConfirmationHandler)
app.post('/logout', isAuthenticated, logoutHandler)
app.post('/verifyqr', isAuthenticated, verifyQRHandler)
app.post('/resetqr', isAuthenticated, resetQRHandler)

app.listen(port, ()=>{
    console.log(`Server is running! Listening on port:${port}`)
})