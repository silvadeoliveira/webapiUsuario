const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
  
const sendErrorsFromDB = (res, dbErrors) => {
    const mensagem = []
    _.forIn(dbErrors.errors, error => mensagem.push(error.message))
    return res.status(400).json({ mensagem })
}

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, process.env.authSecret, {
                expiresIn: "1 day"
            })
            const { name, email } = user
            res.json({ name, email, token })
        } else {
            return res.status(400).send({ mensagem: ['Usuário/Senha inválidos'] })
        }
    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, process.env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const signup = (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''
    const telefones = req.body.telefones || ''
    const ultimo_login = Date.now()
       
   
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ mensagem: ['Senhas não conferem.'] })
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ mensagem: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new User({ name, email, password: passwordHash, ultimo_login, telefones })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}

module.exports = { login, signup, validateToken }