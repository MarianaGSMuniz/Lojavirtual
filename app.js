require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const app = express()

//open route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo!' })
})

mongoose.connect().then(() => {
    app.listen(3000)
    console.log('Conectou ao Banco!')
}).catch((err) => console.log(err))
app.listen(3000)