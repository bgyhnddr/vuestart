var Sequelize = require('sequelize')

var fs = require('fs')
if (!fs.existsSync("src/db/data")) {
    fs.mkdirSync("src/db/data")
}
var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'src/db/data/database.db',
    logging: false
})
module.exports = sequelize