import express from 'express';
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.listen(3000, ()=>{
    `Server is running! Listening on port ${port}`
})