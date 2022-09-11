const pool = require('../database.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const speakeasy = require('speakeasy')
const sendEmail = require('../nodemailer/main.js')

dotenv.config()

class User {

    async signup({id, first_name, last_name, email, password, base32, otpauth_url}, req){
        
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
            await this.sendConfirmation(id, req)
            return ({data: results.rows[0]})
        }
        catch(e){
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async signin(email, password){
        try {
        const client = await pool.connect()
        const users = await client.query('SELECT * FROM users WHERE email = $1', [email])
        const user = users.rows[0]
        if(!user){
            client.release()
            return ({clientError: 'Account does not exist!'})
        }
        const secrets = await client.query('SELECT * FROM secrets WHERE user_id = $1', [user.id]) 
        const verified = secrets.rows[0].verified
        if(!user.confirmed){
            client.release()
            return ({clientError: 'Please confirm your Email first.'})
        }
        client.release()
        if(user && bcrypt.compareSync(password, user.password)){
            return ({data: {...user, verified}})
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

    async twoFactorAuth(id, token) {
        try{
            const client = await pool.connect()
            const results = await client.query('SELECT * FROM  secrets WHERE user_id = $1', [id])
            const tokenValidates = speakeasy.totp.verify({
                secret: results.rows[0].base32,
                encoding: 'base32',
                token,
            });
            client.release()
            if(tokenValidates){
                return ({data: 'OTP was validated successfully!'})
            } else {
                return({clientError: 'Invalid OTP'})
            }
        } catch(e){
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async sendConfirmation (id, req) {
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
            await sendEmail(user.first_name, user.email, link)
            return({data: 'Confirmation Email was sent successfully!'})
        } catch (e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async logout() {
        try{
            return ({data: 'Logged out!'})
        } catch (e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async verifyQR(id) {
        try{
            const client = await pool.connect()
            await client.query('UPDATE secrets SET verified = $1 WHERE user_id = $2', [true, id])
            client.release()
            return({data: 'QR was verified successfully!'})
        } catch(e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async resetQR(id) {
        try{
            const client = await pool.connect()
            await client.query('UPDATE secrets SET verified = $1 WHERE user_id = $2', [false, id])
            client.release()
            return({data: 'You can now verify the QR again!'})
        } catch(e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }
}

const user = new User()

module.exports = user