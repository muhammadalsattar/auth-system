const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const { signinHandler, signupHandler, verifySecretHandler, confirmEmailHandler, sendConfirmationHandler, logoutHandler } = require('./handlers/user');

dotenv.config();

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.post('/signin', signinHandler)
app.post('/signup', signupHandler)
app.post('/verify', verifySecretHandler)
app.get('/confirm/:token', confirmEmailHandler)
app.post('/sendconfirmation', sendConfirmationHandler)
app.post('/logout', logoutHandler)

app.listen(port, ()=>{
    console.log(`Server is running! Listening on port:${port}`)
})