const speakeasy = require('speakeasy')
const { v4: uuidv4 } = require('uuid');
const userInstance = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../nodemailer/main.js')

const signinHandler = async (req, res)=>{
    const {email, password} = req.body;
    const response = await userInstance.signin(email, password)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const signupHandler = async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    const {base32, otpauth_url} = speakeasy.generateSecret()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const id = uuidv4()
    const response = await userInstance.create({id, first_name, last_name, email, password: hashedPassword, base32, otpauth_url})    
    if(response.data){
        const token = jwt.sign({id}, process.env.JWTSECRET, { expiresIn: '4h' });
        const link = `${req.protocol}://${req.get('host')}/confirm/${token}`
        await sendEmail(first_name, email, link)
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const confirmEmailHandler = async (req,res)=>{
    const token = req.params.token
    const response = await userInstance.confirmEmail(token)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const verifySecretHandler = async (req, res)=>{
    const {id, token} = req.body
    const response = await userInstance.verifySecret(id, token)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const sendConfirmationHandler = async(req, res)=>{
    const {id} = req.body
    const response = await userInstance.sendConfirmation(id)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const logoutHandler = async(req, res)=>{
    const {id} = req.body
    const response = await userInstance.logout(id)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

module.exports = {signinHandler, signupHandler, verifySecretHandler, confirmEmailHandler, sendConfirmationHandler, logoutHandler}