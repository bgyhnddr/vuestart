var Sequelize = require('sequelize')
module.exports = function(req, res, next) {
    Promise.all([
        require('./models/user'),
        require('./models/role'),
        require('./models/permission'),
        require('./models/user_role'),
        require('./models/role_permission'),
        require('./models/attachment'),
        require('./models/file')
    ].map((o) => o.sync({ force: true }))).then(function() {
        return require('./init_data')()
    }).then(() => {
        return require('./init_app_data')()
    }).then(function() {
        res.send("success")
    }).catch(function(err) {
        res.send(err)
    })
}