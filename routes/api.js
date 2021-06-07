const express = require('express')
const router = express.Router()
const request = require('request')
const SongList = require('../Models/Playlist')

router.get('/search/:song/:at', function(req, res) {
    let song =  req.params.song
    let at = req.params.at

    request(`https://api.spotify.com/v1/search?q=${song}&type=track&token_type=Bearer&access_token=${at}`,function(err, response, data) {
            res.send(JSON.parse(data));
        }
      )
})

router.get('/isAdded/:id', function (req, res) {
    let id = req.params.id
    SongList.find({id:id}, function (err, song) {
        if(song.length>0)
        res.send(true)
        else
        res.send(false)
    })
})

router.get('/playlist', function (req, res) {
    SongList.find({}, function (err, playlist) {
        res.send(playlist)
    })
})

router.get('/new/:at', function(req, res){
    let at = req.params.at
    request(`https://api.spotify.com/v1/browse/new-releases?token_type=Bearer&access_token=${at}`,function(err, response, data) {
            res.send(JSON.parse(data));
        })
})

router.get('/gener/:type/:at', function(req, res){
    let type = req.params.type
    let at = req.params.at

    request(`https://api.spotify.com/v1/browse/categories/${type}/playlists?access_token=${at}&token_type=Bearer`,function(err, response, data) {
        res.send(JSON.parse(data));
        })
})

router.post('/saveSong', function (req, res){
    let song = new SongList(req.body)
    song.save()
    res.send('ok')
})

router.delete('/delFromDb/:id', function (req, res){
    let songId = req.params.id
    SongList.remove({id:songId}, function(err, song){
        res.send('deleted')
    });
})

module.exports = router