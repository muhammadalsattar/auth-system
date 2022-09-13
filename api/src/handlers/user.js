const speakeasy = require('speakeasy')
const { v4: uuidv4 } = require('uuid');
const userInstance = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const getUserHandler = async (req, res)=>{
    const id = req.user.id
    const response = await userInstance.getUser(id)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

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
    const {first_name, last_name, email, password, client_url} = req.body
    const {base32, otpauth_url} = speakeasy.generateSecret()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const id = uuidv4()
    const response = await userInstance.signup({id, first_name, last_name, email, password: hashedPassword, base32, otpauth_url, client_url})    
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const twoFactorAuthHandler = async (req, res)=>{
    const {email, otp} = req.body
    const response = await userInstance.twoFactorAuth(email, otp)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(403).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const confirmEmailHandler = async (req,res)=>{
    const token = req.params.token
    const response = await userInstance.confirmEmail(token)
    if(response.data){
        res.send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const sendConfirmationHandler = async(req, res)=>{
    const {email, client_url} = req.body
    const response = await userInstance.sendConfirmation(email, client_url)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const logoutHandler = async(req, res)=>{
    const id = req.user.id
    const response = await userInstance.logout(id)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const verifyQRHandler = async(req,res)=>{
    const {email} = req.body
    const response = await userInstance.verifyQR(email)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const resetQRHandler = async(req,res)=>{
    const {email} = req.body
    const response = await userInstance.resetQR(email)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}



module.exports = {getUserHandler ,signinHandler, signupHandler, twoFactorAuthHandler, confirmEmailHandler, sendConfirmationHandler, logoutHandler, verifyQRHandler, resetQRHandler}