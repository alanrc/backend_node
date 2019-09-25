/* -----   Modulos   ----- */
const  express = require('express')
const bodyParser = require('body-parser')
const lokijs = require('lokijs')

/* -----   Auxiliares   ----- */
const server = express()
const port = 2000
const header = {'Content-Type': 'application/json; charset=utf-8'}

let personas = null

const db = new lokijs('datos.js', {
    autoload: true,
    autosave: true,
    autosaveInterval: 5000,
    autoloadCallback: () => {
        // Obtener la coleccion 'personas' ó crear la coleccion 'personas'
        personas = db.getCollection('personas') || db.addCollection('personas')
    }
})

/* -----   Configuraciones   ----- */
server.listen(port)
// console.log('Server on port: ', port)
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

/* -----   Procesos   ----- */
server.get('/api', (req, res) => {
    // console.log(personas)
    res.set(header)
    res.json(personas.data)
})

server.post('/api', (req, res) => {
    
    let persona = req.body

    personas.insert(persona)

    res.set(header)
    res.json({'resp': 'ok'})
})