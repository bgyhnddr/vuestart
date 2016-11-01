module.exports = function(req, res, next) {
    var user_role = require('../db/models/user_role')
    var role_permission = require('../db/models/role_permission')

    role_permission.belongsTo(user_role, {
        foreignKey: 'role_code',
        targetKey: 'role_code',
        constraints: false
    })

    return new Promise(function(resolve, reject) {
        if (!req.session.userInfo) {
            reject("not_login")
        } else {
            role_permission.findAll({
                include: [{
                    model: user_role,
                    where: {
                        user_account: req.session.userInfo.name
                    }
                }]
            }).then(function(result) {
                if (
                    result.map(o => o.permission_code).some(function(o) {
                        return o == req.params.type || o == "admin"
                    })
                ) {
                    resolve()
                } else {
                    reject("no_authorization")
                }
            })
        }
    })
}