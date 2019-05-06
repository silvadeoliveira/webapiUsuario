const Usuario = require('./user')
const _ = require('lodash')

Usuario.methods(['get', 'post', 'put', 'delete'])
Usuario.updateOptions({ new: true, runValidators: true })

Usuario.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

function sendErrorsOrNext(req, res, next) {
    const bundle = res.locals.bundle

    if (bundle.errors) {
        var errors = parseErrors(bundle.errors)
        res.status(500).json({ errors })
    } else {
        next()
    }
}
function parseErrors(nodeRestfulErrors) {
    const mensagem = []
    _.forIn(nodeRestfulErrors, error => mensagem.push(error.message))
    return mensagem
}

Usuario.route('count', function (req, res, next) {
    BillingCycle.count(function (error, value) {
        if (error) {
            res.status(500).json({ mensagem: [error] })
        } else {
            res.json({ value })
        }
    })
})

module.exports = Usuario