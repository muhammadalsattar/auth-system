import user from '../models/User.js';

const speakeasy = require('speakeasy')
const uuid = require('uuid')
const user = require('../models/User.js')

export const signinHandler = async (req, res)=>{
    const {email, password} = req.body;
    const user = await user.signin(email, password)
    req.user = user
    user? res.send(user): res.status(400).send({'Error': 'Invalid credentials'})
}

export const signupHandler = async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    const {base32, otpauth_url} = speakeasy.generateSecret()
    try{
        const user = await user.create({id: uuid(), first_name, last_name, email, password, base32, otpauth_url})
        
        // Confirmation Email code goes here

        res.send(user)
    } catch(e){
        res.status(400).send({'Error': e})
    }
}

export const confirmEmailHandler = async (req,res)=>{
    const token = req.params.token
    try{
        await user.confirmEmail(token)
        res.send({'Success': 'Email confirmed successfully!'})
    } catch(e) {
        res.status(400).send({'Error': e})
    }
}

export const verifySecretHandler = async (req, res)=>{
    const token = req.body.token
    const id = req.user.id
    try{
        await user.verifySecret(id, token)
        res.status(200).send({'Success': 'Token verified successfully!'})
    } catch (e) {
        res.status(400).send({'Error': e})
    }
}