const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const { signinHandler, signupHandler, verifySecretHandler, confirmEmailHandler } = require('./handlers/user');
const main = require('./nodemailer/main.js')

// main('Muhammad', 'muhammadalsattar@gmail.com', 'https://linkedin.com/in/muhammadalsattar')

dotenv.config();

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())


app.post('/signin', signinHandler)
app.post('/signup', signupHandler)
app.post('/verify', verifySecretHandler)
app.get('/confirm/:token', confirmEmailHandler)

app.listen(port, ()=>{
    console.log(`Server is running! Listening on port ${port}`)
})