const express = require('express')
const path = require('path')
const api = require('./routes/api')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 3500

// Mongoose setup
mongoose.connect('mongodb://localhost/SongList', { useNewUrlParser: true })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use('/', api);


app.listen(port, function(){
    console.log(`Running server on port ${port}`)
})