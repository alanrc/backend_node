/* -----   Modulos   ----- */
const  express = require('express')
const bodyParser = require('body-parser')
const lokijs = require('lokijs')



/* -----   Auxiliares   ----- */
const server = express()
const port = 2000
const header = {'Content-Type': 'application/json; charset=utf-8'}

let peliculas = null

const db = new lokijs('nerdflix.json', {
    autoload: true,
    autosave: true,
    autosaveInterval: 5000,
    autoloadCallback: () => {
        // Obtener la coleccion 'peliculas' ó crear la coleccion 'peliculas'
        peliculas = db.getCollection('peliculas') || db.addCollection('peliculas')
    }
})

/* -----   Configuraciones   ----- */
server.listen(port)
// console.log('Server on port: ', port)
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())
server.use(express.static('./public'))

server.set('json spaces', 4)

/* -----   Procesos   ----- */


server.get('/api', (req, res) => {
    // console.log(peliculas)
    res.json(peliculas.data)
})

// Obtener una sola pelicula x ID
server.get('/api/:id', (req, res) => {
    let elID = req.params.id

    let laPelicula = peliculas.get(elID) || {error: 'Pelicula no encontrada'}

    res.json(laPelicula)
})

// Crear una nueva pelicula...
server.post('/api', (req, res) => {
    
    let pelicula = req.body
    console.log(pelicula);
    
    peliculas.insert(pelicula)
    res.json({'resp': 'ok'})
})

// Actulizar una nueva pelicula por ID
server.put('/api/:id', (req, res) => {
    let elID = req.params.id

    let laPelicula = peliculas.get(elID)

    let nuevosDatos = req.body

    laPelicula.titulo = nuevosDatos.titulo
    laPelicula.descripcion = nuevosDatos.descripcion
    laPelicula.estreno = nuevosDatos.estreno
    laPelicula.poster = nuevosDatos.poster
    laPelicula.trailer = nuevosDatos.trailer

    peliculas.update(laPelicula)

    res.json({'pelicula_actulizada': laPelicula})
})