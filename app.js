require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const app = express()

//JSON
app.use(express.json())

//models
const User = require('./models/User')

//open route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo!' })
})

// private route
app.get("/user/:id", async(req, res) => {
    const id = req.params.id

    //check if user exists

    const user = await User.findBuId(id, 'password')

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' })

    }
})

//Register User 
app.post('/auth/register', async(req, res) => {

    const { name, email, password, confirmpassword } = req.body

    //validação
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' })
    }

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' })
    }

    if (!passwordl) {
        return res.status(422).json({ msg: 'A senha é obrigatório!' })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    //check if user exists
    const userExists = await Uswer.findOne({ email: email })
    if (userExists) {

        return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!' })
    }
    // password 
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // user
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {

        await user.save()
        res.status(201).json({ msg: 'Uasuário criado com sucesso!' })

    } catch (error) {

        res.status(500).json({ msg: error })


    }

})

// loggin

app.post("/auth/user", async(req, res) => {

    const { email, password } = req.body

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' })
    }

    if (!passwordl) {
        return res.status(422).json({ msg: 'A senha é obrigatório!' })
    }

    //check user  if exists 
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
                id: user._id,
            },
            secret,
        )
        res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })

    } catch (err) {
        console.log(error)

        res.status(500).json({
            msg: 'Aconteceu erro no servidor, tente novamente mais tarde!'
        })
    }

})

//credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.DB_PASS

mongoose.connect('mongodb+srv://${dbUser}:${dbPassword }@cluster0.s1y1q.mongodb.net/?retryWrites=true&w=majority').then(() => {
    app.listen(3000)
    console.log('Conectou ao Banco!')
}).catch((err) => console.log(err))
app.listen(3000)