const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv');
const { signinHandler, signupHandler, confirmEmailHandler, sendConfirmationHandler, logoutHandler, verifyQRHandler, resetQRHandler, twoFactorAuthHandler, getUserHandler } = require('./handlers/user');
const isAuthenticated = require('./middlewares/isAuthenticated.js');

dotenv.config();

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(cors({
    credentials: true,
  }))


app.get('/auth', isAuthenticated, getUserHandler)
app.post('/signin', signinHandler)
app.post('/signup', signupHandler)
app.post('/twofactorauth', twoFactorAuthHandler)
app.get('/confirm/:token', confirmEmailHandler)
app.post('/sendconfirmation', sendConfirmationHandler)
app.post('/logout', isAuthenticated, logoutHandler)
app.post('/verifyqr', verifyQRHandler)
app.post('/resetqr', resetQRHandler)

app.listen(port, ()=>{
    console.log(`Server is running! Listening on port:${port}`)
})