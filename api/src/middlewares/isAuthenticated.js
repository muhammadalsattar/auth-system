const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const pool = require('../database')

const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.JWTSECRET)
        if(!decoded) res.status(403).send({error: 'Unautorized! Please login first'})
        const client = await pool.connect()
        const results = await client.query("SELECT * FROM users WHERE id=$1", [decoded.id])
        const user = results.rows[0]
        if(!user) res.status(403).send({error: 'Unautorized! Please login first!'})
        req.user = user
        req.token = token
        next()
    } catch(e) {
        res.status(403).send({error: 'Unautorized! Please login first!'})
    }
    
}

module.exports = isAuthenticated