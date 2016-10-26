var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')


module.exports = (app) => {
    app.use('/init', function(req, res, next) {
        var init = require('../db/init')
        init(req, res, next)
    })

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(session({ secret: '1234567890QWERTY' }))

    app.use('/service/:permission/:type/:action', function(req, res, next) {
        console.log("request:" + req.originalUrl)
        if (req.params.permission == "private") {
            var checkPermission = require('../permission/check-permission')
            checkPermission(req, res, next).then(function() {
                require('./private/' + req.params.type)(req, res, next)
            }, function(error) {
                if (error == "not_login") {
                    res.status(404).send({
                        "code": "not_login",
                        "msg": 'not login'
                    })
                } else if (error == "no_authorization") {
                    res.status(404).send({
                        "code": "no_authorization",
                        "msg": 'no authorization'
                    })
                }
            })
        } else if (req.params.permission == "public") {
            require('./public/' + req.params.type)(req, res, next)
        }
    })
}