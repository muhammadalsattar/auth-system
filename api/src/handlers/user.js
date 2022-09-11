const speakeasy = require('speakeasy')
const { v4: uuidv4 } = require('uuid');
const userInstance = require('../models/User.js')
const bcrypt = require('bcrypt')

const signinHandler = async (req, res)=>{
    const {email, password} = req.body;
    const response = await userInstance.signin(email, password)
    if(response.data){
        req.session.regenerate(err=>err&&next(err))         // regenerate the session, which is good practice to help guard against forms of session fixation
        req.session.user = response.data.id         // store user information in session, typically a user id
        req.session.save(err=>err&&next(err))         // save the session before redirection to ensure page load does not happen before session is saved
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const signupHandler = async (req, res) => {
    const {first_name, last_name, email, password, client} = req.body
    const {base32, otpauth_url} = speakeasy.generateSecret()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const id = uuidv4()
    const response = await userInstance.signup({id, first_name, last_name, email, password: hashedPassword, base32, otpauth_url}, req)    
    if(response.data){
        req.session.regenerate(err=>err&&next(err))     // regenerate the session, which is good practice to help guard against forms of session fixation
        req.session.client_url = client   // Save client url on session      
        req.session.save(err=>err&&next(err))   // Save client url on server
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const twoFactorAuthHandler = async (req, res)=>{
    const {token} = req.body
    const id = req.session.user
    const response = await userInstance.twoFactorAuth(id, token)
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
        res.redirect(req.session.client_url)
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const sendConfirmationHandler = async(req, res)=>{
    const {client} = req.body
    const id = req.session.user
    const response = await userInstance.sendConfirmation(id, req)
    if(response.data){
        req.session.client_url = client     // Save client on session
        req.session.save(err=>err&&next(err))
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const logoutHandler = async(req, res)=>{
    const response = await userInstance.logout()
    if(response.data){
        req.session.user = null         // clear the user from the session object and save.
        req.session.save(err=>err&&next(err))
        req.session.regenerate(err=>err&&next(err))        // regenerate the session, which is good practice to help guard against forms of session fixation
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const verifyQRHandler = async(req,res)=>{
    const id = req.session.user
    const response = await userInstance.verifyQR(id)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}

const resetQRHandler = async(req,res)=>{
    const id = req.session.user
    const response = await userInstance.resetQR(id)
    if(response.data){
        res.status(200).send({data: response.data})
    } else if(response.clientError){
        res.status(400).send({error: response.clientError})
    } else {
        res.status(500).send({error: response.error})
    }
}



module.exports = {signinHandler, signupHandler, twoFactorAuthHandler, confirmEmailHandler, sendConfirmationHandler, logoutHandler, verifyQRHandler, resetQRHandler}