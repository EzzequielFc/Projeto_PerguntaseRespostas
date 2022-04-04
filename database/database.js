// Conexão com o Sequelize
const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','Senha', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
