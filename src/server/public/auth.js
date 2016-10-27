var exec = {
    login(req, res, next) {
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
    },
    logout(req, res, next) {
        req.session.userInfo = undefined
    },
    getUser(req, res, next) {
        return req.session.userInfo
    },
    changePassword(req, res, next) {
        var userInfo = req.session.userInfo
        if (userInfo) {
            var user = require('../db/models/user')
            return user.findOne({
                where: {
                    account: userInfo.name,
                    password: req.body.password
                }
            }).then((result) => {
                if (result == null) {
                    return Promise.reject("account or password incorrect")
                } else {
                    result.password = req.body.newPassword
                    return result.save()
                }
            })
        } else {
            return Promise.reject("not login")
        }
    }
}




module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        return exec[result](req, res, next)
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}