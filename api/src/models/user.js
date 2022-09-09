const pool = require('../database.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

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

    async login({email, password}){
        try{
            const query = `SELECT * FROM users WHERE email = ${email}`
            const client = await pool.connect()
            const user = await client.query(query)
            client.release()
            user && bcrypt.compareSync(password, user.password)? user: null
        } catch(e) {
            throw new Error(e)
        }
    }

    async confirm(token){
        try{
            const decoded = jwt.verify(token, process.env.JWTSECRET)
            const query = `UPDATE users SET confirmed = ${true} WHERE secret = ${decoded.secret}`
            const client = pool.connect()
            client.query(query)
            client.release
        } catch(e){
            throw new Error(e)
        }
    }
}

export default User;