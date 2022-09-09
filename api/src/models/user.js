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
            const duplicates = await client.query('SELECT * FROM users WHERE email=$1', [email])
            if(duplicates.length > 0) {
                client.release()
                return({clientError: 'Email already registered!'})
            }
            const results = await client.query('INSERT INTO users(id, first_name, last_name, email, password, confirmed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [id, first_name, last_name, email, password, false])  
            await client.query('INSERT INTO secrets(user_id, base32, otpauth_url, verified) VALUES($1, $2, $3, $4)', [id, base32, otpauth_url, false])
            client.release()
            return ({data: results.rows[0]})
        }
        catch(e){
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async signin(email, password){
        try {
        const client = await pool.connect()
        const results = await client.query('SELECT * FROM users WHERE email = $1', [email])
        const user = results.rows[0]
        if(!user.confirmed){
            client.release()
            return ({clientError: 'Please confirm your Email first.'})
        }
        client.release()
        if(user && bcrypt.compareSync(password, user.password)){
            return ({data: user})
        } else {
            return ({clientError: 'Invalid credntials!'})
        }
        } catch (e) {
            return ({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async confirmEmail(token){
        try{
            const decoded = jwt.verify(token, process.env.JWTSECRET)
            const client = await pool.connect()
            const results = await client.query('SELECT * FROM users WHERE id = $1',[decoded.id])
            const user = results.rows[0] 
            if(user.confirmed){
                client.release()
                return({clientError: 'Email already confirmed!'})
            }
            await client.query('UPDATE users SET confirmed = $1 WHERE id = $2 RETURNING id', [true, user.id])
            client.release
            return ({data: 'Email confirmed successfully!'})
        } catch(e){
            if(e.name === 'TokenExpiredError') {
                return ({clientError: e.message})
            } else{
            return({error: 'Something went wrong on our side! please try again later'})
            }
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
                return ({data: results.rows[0]})
            } else {
                client.release()
                return({clientError: 'Invalid Token!'})
            }
        } catch(e){
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async sendConfirmation (id) {
        try {
            const client = await pool.connect()
            const results = await client.query('SELECT * FROM users WHERE id = $1',[id])
            const user = results.rows[0] 
            if(user.confirmed){
                client.release()
                return({clientError: 'Email already confirmed!'})
            }
            client.release()
            const token = jwt.sign({id}, process.env.JWTSECRET, { expiresIn: '4h' });
            const link = `${req.protocol}://${req.get('host')}/confirm/${token}`
            await sendEmail(first_name, email, link)
            return({data: 'Confirmation Email was sent successfully!'})
        } catch (e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async logout(id) {
        try{
            const client = await pool.connect()
            const results = await client.query('UPDATE secrets SET verified = $1 WHERE user_id = $2 RETURNING *', [false, id])
            return ({data: results.rows[0]})
        } catch (e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }
}

const user = new User()

module.exports = user