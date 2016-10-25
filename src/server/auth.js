var login = function(req, res, next) {
    var account = req.body.account
    var password = req.body.password

    var user = require('../db/models/user')

    return user.findOne({
        attributes: ['account', 'password'],
        where: {
            account: account
        }
    }).then(function(result) {
        if (result == null) {
            return Promise.reject("account not exists")
        } else {
            if (result.password != password) {
                return Promise.reject("password incorrect")
            } else {
                var user_role = require('../db/models/user_role')
                var role_permission = require('../db/models/role_permission')

                role_permission.belongsTo(user_role, {
                    foreignKey: 'role_code',
                    targetKey: 'role_code',
                    constraints: false
                })
                return role_permission.findAll({
                    include: [{
                        model: user_role,
                        where: {
                            user_account: result.account
                        }
                    }]
                })
            }
        }
    }).then(function(result) {
        if (result != null) {
            var userInfo = {}
            userInfo.name = account
            userInfo.permissions = result.map(o => o.permission_code)
            req.session.userInfo = userInfo
            return req.session.userInfo
        }
    })
}

var logout = function(req, res, next) {
    req.session.userInfo = undefined
}

var getUser = function(req, res, next) {
    return req.session.userInfo
}




module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        switch (result) {
            case "login":
                return login(req, res, next)
            case "logout":
                return logout(req, res, next)
            case "getUser":
                return getUser(req, res, next)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}