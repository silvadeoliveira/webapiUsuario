const express = require('express');
const auth = require('./auth')

module.exports = function (server) {


    /*********************
    *Rotas abertas
    **********************/
    const openApi = express.Router()
    server.use('/oapi', openApi)

    const AuthService = require('../api/user/authService')
    openApi.post('/login', AuthService.login)
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
    


   
/********************************
* Rotas protegidas por Token JWT
*******************************/

const protectedApi = express.Router()

server.use('/api', protectedApi)


protectedApi.use(auth)
    const usuarioService = require('../api/user/usuarioService')
    usuarioService.register(protectedApi, '/usuario')
 }