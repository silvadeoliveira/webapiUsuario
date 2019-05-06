const restful = require('node-restful')
const mongoose = restful.mongoose

const telefoneSchema = new mongoose.Schema({
    numero: { type: Number, min: 0, required: true },
    ddd: { type: Number, min: 0, required: true }
})


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 6, max: 12, required: true },
    data_criacao : {type: Date, default: Date.now},
    data_atualizacao: { type: Date},
    ultimo_login: { type: Date },
    telefones: [telefoneSchema]
})

module.exports = restful.model('User', userSchema)