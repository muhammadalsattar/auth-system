const pool = require('../database.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const speakeasy = require('speakeasy')

dotenv.config()

class User {
    async create({id, first_name, last_name, email, password, secret, confirmed}){
        try{
        const query = `INSERT INTO users(id, first_name, last_name, email, password, secret, confirmed) VALUES(${id}, ${first_name}, ${last_name}, ${email}, ${password}, ${secret}, ${confirmed}) RETURNING *`
        const client = await pool.connect();
        const results = await client.query(query)
        client.release()
        return results.rows[0]
        }
        catch(e){
            throw new Error(e)
        }
    }

    async signin(email, password){
        try{
            const query = `SELECT * FROM users WHERE email = ${email}`
            const client = await pool.connect()
            const user = await client.query(query).rows[0]
            client.release()
            user && bcrypt.compareSync(password, user.password)? user: null
        } catch(e) {
            throw new Error(e)
        }
    }

    async confirmEmail(token){
        try{
            const decoded = jwt.verify(token, process.env.JWTSECRET)
            const query = `UPDATE users SET confirmed = ${true} WHERE secret = ${decoded.id}`
            const client = pool.connect()
            client.query(query)
            client.release
        } catch(e){
            throw new Error(e)
        }
    }

    async verifySecret (id, token) {
        try{
            const client = await pool.connect()
            const results = await client.query(`SELECT * FROM  secrets WHERE user_id = ${id}`)
            const verified = results.rows[0].verified
            const tokenValidates = speakeasy.totp.verify({
                secret: results.rows[0].base32,
                encoding: 'base32',
                token,
            });
            if(tokenValidates){
                !verified && await client.query(`UPDATE secrets SET verified = ${true} WHERE user_id = ${id}`)
                const user = await client.query(`SELECT * FROM users WHERE id = ${id}`)
                client.release()
                return user
            }
            client.release()
        } catch(e){
            throw new Error(e)
        }
    }
}

export default User;