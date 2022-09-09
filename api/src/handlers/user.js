const speakeasy = require('speakeasy')
const User = require('../models/User.js')

export const signinHandler =  async (req, res)=>{
    const {email, password} = req.body;
    const user = User.signin(email, password)
    user && user
}