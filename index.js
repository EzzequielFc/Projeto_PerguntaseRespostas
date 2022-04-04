const express = require('express') // Importando o modulo do express
const app = express() // Criando uma "copia" do express
const bodyParser = require('body-parser')// Responsavel por traduzir os dados enviados pelo formulario para estrutura javascript
const connection = require('./database/database') // importando a conexão da database
const Pergunta = require('./database/Pergunta') // importando model de perguntas do database
const Resposta = require('./database/Resposta') // importando model de respostas

//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((erro) => {
        console.log(erro)
    })

app.set('view engine', 'ejs') // Setando o EJS como a view engine(motor do html)
app.use(express.static('public')) // Arquivos estáticos (imagens, css, videos)

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Rota tela principal
app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[['id','DESC']]})// Select * from tabela
        .then(perguntas =>  {
            res.render("index",{ // Renderizando o HTML e enviando as perguntas
                perguntas: perguntas
            }) 
        })
    
})

app.get("/perguntar",(req, res) => {
    res.render("perguntar")
})

// Receber os Dados do formulario
app.post("/salvarpergunta",(req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    // insert into
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        // Redireciona após ser salvo
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    // Busca por ID
    Pergunta.findOne({
        where: {id:id} // Where = Onde
    }).then(pergunta =>{
        if(pergunta != undefined){ // Pergunta Encontrada

            Resposta.findAll({
                where:{perguntasId: pergunta.id}
            }).then(respostas => {
                res.render("pergunta",{pergunta,respostas})
            })
        }else{ // Pergunta não encontrada
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo
    var perguntasId = req.body.pergunta
    Resposta.create({
        corpo:corpo,
        perguntasId:perguntasId
    }).then(() => {
        res.redirect("/pergunta/" + perguntasId)
    })
})

// Abrindo o server
app.listen(8080, () => {
    console.log("Site aberto")
})