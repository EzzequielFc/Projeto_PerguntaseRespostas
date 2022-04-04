const Sequelize = require('sequelize')
const connection = require('./database')

const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING, // tipo
        allowNull: false //not null
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Pergunta.sync({force: false}).then(()=>{console.log("!Tabela Criada!")})

module.exports = Pergunta