const pool = require('../database.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const speakeasy = require('speakeasy')
const sendEmail = require('../nodemailer/main.js')

dotenv.config()

class User {

    async getUser(id){
        try{
            const client = await pool.connect()
            const users = await client.query("SELECT * FROM users WHERE id=$1",[id])
            const secrets = await client.query("SELECT * FROM secrets WHERE user_id=$1",[id])
            client.release()
            return ({data: {...users.rows[0], verified: secrets.rows[0].verified, otpauth_url: secrets.rows[0].otpauth_url}})
        }
        catch(e){
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async signup({id, first_name, last_name, email, password, base32, otpauth_url, client_url}){
        
        try{
            const client = await pool.connect();
            const duplicates = await client.query('SELECT * FROM users WHERE email=$1', [email])
            if(duplicates.rows.length > 0) {
                client.release()
                return({clientError: 'Email already registered!'})
            }
            const results = await client.query('INSERT INTO users(id, first_name, last_name, email, password, confirmed) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [id, first_name, last_name, email, password, false])  
            await client.query('INSERT INTO secrets(user_id, base32, otpauth_url, verified) VALUES($1, $2, $3, $4)', [id, base32, otpauth_url, false])
            client.release()
            await this.sendConfirmation(email, client_url)
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
            return ({clientError: 'This Email is Not Registered'})
        }
        const secrets = await client.query('SELECT * FROM secrets WHERE user_id = $1', [user.id]) 
        if(!user.confirmed){
            client.release()
            return ({clientError: 'Please confirm your Email first.'})
        }
        client.release()
        if(user && bcrypt.compareSync(password, user.password)){
            return ({data: {verified:secrets.rows[0].verified, otpauth_url:secrets.rows[0].otpauth_url}})
        } else {
            return ({clientError: 'Invalid credentials!'})
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
            if(e.name === 'JsonWebTokenError') {
                return ({clientError: 'Confirmation Link Expired!'})
            } else{
            return({error: 'Something went wrong on our side! please try again later'})
            }
        }
    }

    async twoFactorAuth(email, otp) {
        try{
            const client = await pool.connect()
            const query = await client.query('SELECT * FROM users WHERE email=$1',[email])
            const user = query.rows[0]
            const results = await client.query('SELECT * FROM  secrets WHERE user_id = $1', [user.id])
            const tokenValidates = speakeasy.totp.verify({
                secret: results.rows[0].base32,
                encoding: 'base32',
                token: otp,
            });
            if(tokenValidates){
                const token = jwt.sign({id: user.id}, process.env.JWTSECRET, {expiresIn: 30 * 60})
                await client.query('UPDATE users SET token=$1 WHERE id=$2 RETURNING *',[token, user.id])
                client.release()
                return ({data: {...user, token}})
            } else {
                client.release()
                return({clientError: 'One Time Password is Invalid!'})
            }
        } catch(e){
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async sendConfirmation (email, client_url) {
        try {
            const client = await pool.connect()
            const results = await client.query('SELECT * FROM users WHERE email = $1',[email])
            const user = results.rows[0] 
            if(!user){
                client.release()
                return({clientError: 'This Email is Not Registered'})
            }
            if(user.confirmed){
                client.release()
                return({clientError: 'Email already confirmed!'})
            }
            client.release()
            const token = jwt.sign({id: user.id}, process.env.JWTSECRET, { expiresIn: '4h' });
            const link = `${client_url}/confirm?q=${token}`
            await sendEmail(user.first_name, user.email, link)
            return({data: 'Confirmation Email was sent successfully!'})
        } catch (e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async logout(id) {
        try{
            const client = await pool.connect()
            await client.query("UPDATE users SET token=$1 WHERE id=$2",['', id])
            client.release()
            return ({data: 'Logged out!'})
        } catch (e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async verifyQR(email) {
        try{
            const client = await pool.connect()
            const users = await client.query('SELECT * FROM users WHERE email=$1',[email])
            const query = await client.query('UPDATE secrets SET verified = $1 WHERE user_id = $2 RETURNING *', [true, users.rows[0].id])
            client.release()
            return({data: query.rows[0].verified})
        } catch(e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }

    async resetQR(email) {
        try{
            const client = await pool.connect()
            const users = await client.query('SELECT * FROM users WHERE email=$1',[email])
            await client.query('UPDATE secrets SET verified = $1 WHERE user_id = $2', [false, users.rows[0].id])
            client.release()
            return({data: 'You can now verify the QR again!'})
        } catch(e) {
            return({error: 'Something went wrong on our side! please try again later'})
        }
    }
}

const user = new User()

module.exports = user