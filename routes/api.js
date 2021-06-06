const express = require('express')
const router = express.Router()
const request = require('request')

let apiKey = "3f2d9ec96c37477c9e1f751bac182e3e"

router.get('/sanity', function (req, res) {
    res.send("OK")
})

router.get('/search/:song/:at', function(req, res) {
    let artistName =  req.params.song
    let at = req.params.at

    request({
        url: `https://api.spotify.com/v1/search?q=${artistName}&type=track`,
        headers: {
            'Authorization' : 'Bearer ' + at
        },
        function(err, response, data) {
          // Load our songs from Spotify into our page
          let num_of_tracks = data.tracks.items.length;

        //   let count = 0;
        //   // Max number of songs is 12
        //   const max_songs = 12;

            // Extract the id of the FIRST song from the data object
            let id = data.tracks.items[count].id;
            // Constructing two different iframes to embed the song
            let src_str = `https://open.spotify.com/embed/track/${id}`;
            let iframe = `<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;
            res.send(iframe);
        }
      })
})



// router.get('/city', function (req, res) {
//     Person.find({}, function (err, people) {
//         res.send(people)
//     })
// })

// router.post('/city', function (req, res){
//     let p = new Person(req.body)
//     p.save()
//     res.send('ok')
// })

// router.put('/city/:id', function(req, res){
//     console.log(req.params.id);
//     Person.findByIdAndUpdate(req.params.id, { age: 80 }, { new: true }, function (err, person) {
//         console.log(person)
//         res.send('updated')
//     })
// })

// router.delete('/apocalypse',function(req,res){
//     Person.collection.removeMany()
//     // Person.deleteMany({},function(){
//     //     console.log("removed")
//     // });
//     res.send('deleted');
// })

module.exports = router