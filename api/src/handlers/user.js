const speakeasy = require('speakeasy')
const { v4: uuidv4 } = require('uuid');
const userInstance = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../nodemailer/main.js')

const signinHandler = async (req, res)=>{
    const {email, password} = req.body;
    const response = await userInstance.signin(email, password)
    if(response.id){
        res.send(response)
    } else{
        res.status(400).send(response)
    }
}

const signupHandler = async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    const {base32, otpauth_url} = speakeasy.generateSecret()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const id = uuidv4()
    const response = await userInstance.create({id, first_name, last_name, email, password: hashedPassword, base32, otpauth_url})    
    
    // Confirmation Email
    const token = jwt.sign({id}, process.env.JWTSECRET, { expiresIn: '4h' });
    const link = `${req.protocol}://${req.get('host')}/confirm/${token}`
    await sendEmail(first_name, email, link)

    if(response.error){
        res.status(400).send(response)
    } else {
        res.send(response)
    }
}

const confirmEmailHandler = async (req,res)=>{
    const token = req.params.token
    const response = await userInstance.confirmEmail(token)
    if(response.id){
        res.send({'Success': 'Email confirmed successfully!'})
    } else{
        res.status(400).send({'error': response})
    }
}

const verifySecretHandler = async (req, res)=>{
    const {id, token} = req.body
    const response = await userInstance.verifySecret(id, token)
    if(response.id){
        res.send({'Success': 'Token verified successfully!'})
    } else {
        res.status(400).send(response)
    }
}

module.exports = {signinHandler, signupHandler, verifySecretHandler, confirmEmailHandler}