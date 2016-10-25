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
                switch (req.params.type) {
                    case "RBAC":
                        require('./RBAC')(req, res, next)
                        break
                    case "upload":
                        require('./upload')(req, res, next)
                        break
                    case "datasource":
                        require('./datasource')(req, res, next)
                        break
                    case "create_quotation":
                        require('./create_quotation')(req, res, next)
                        break
                    case "view_quotation":
                        require('./view_quotation')(req, res, next)
                        break
                    case "edit_quotation":
                        require('./edit_quotation')(req, res, next)
                        break
                    case "confirm_quotation":
                        require('./confirm_quotation')(req, res, next)
                        break
                    case "confirm_quotation_boss":
                        require('./confirm_quotation_boss')(req, res, next)
                        break

                }
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
            switch (req.params.type) {
                case "auth":
                    require('./auth')(req, res, next)
                    break
            }
        }
    })
}