const pool = require('../database.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const speakeasy = require('speakeasy')

dotenv.config()

class User {
    async create({id, first_name, last_name, email, password, base32, otpauth_url}){
        
        try{
            const client = await pool.connect();
            const results = await client.query('INSERT INTO users(id, first_name, last_name, email, password, confirmed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [id, first_name, last_name, email, password, false])  
            await client.query('INSERT INTO secrets(user_id, base32, otpauth_url, verified) VALUES($1, $2, $3, $4)', [id, base32, otpauth_url, false])
            client.release()
            return results.rows[0]
        }
        catch(e){
            return(e)
        }
    }

    async signin(email, password){
        try {
        const client = await pool.connect()
        const results = await client.query('SELECT * FROM users WHERE email = $1', [email])
        const user = results.rows[0]
        client.release()
        if(user && bcrypt.compareSync(password, user.password)){
            return (user)
        } else {
            return ({error: 'Invalid credntials!'})
        }
        } catch (e) {
            return (e)
        }
    }

    async confirmEmail(token){
        try{
            const decoded = jwt.verify(token, process.env.JWTSECRET)
            const client = await pool.connect()
            const user = await (await client.query('SELECT * FROM users WHERE id = $1',[decoded.id])).rows[0]
            const response = await client.query('UPDATE users SET confirmed = $1 WHERE id = $2 RETURNING id', [true, user.id])
            client.release
            return response
        } catch(e){
            return(e)
        }
    }

    async verifySecret (id, token) {
        try{
            const client = await pool.connect()
            const results = await client.query('SELECT * FROM  secrets WHERE user_id = $1', [id])
            const verified = results.rows[0].verified
            const tokenValidates = speakeasy.totp.verify({
                secret: results.rows[0].base32,
                encoding: 'base32',
                token,
            });
            if(tokenValidates){
                !verified && await client.query('UPDATE secrets SET verified = $1 WHERE user_id = $2', [true, id])
                const results = await client.query('SELECT * FROM users WHERE id = $1', [id])
                client.release()
                return results.rows[0]
            } else {
                client.release()
                throw new Error('Invalid Token!')
            }
        } catch(e){
            console.log(e)
            return(e)
        }
    }
}

const user = new User()

module.exports = user