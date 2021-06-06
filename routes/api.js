const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/search/:song/:at', function(req, res) {
    let artistName =  req.params.song
    let at = req.params.at

    request(`https://api.spotify.com/v1/search?q=${artistName}&type=track&token_type=Bearer&access_token=${at}`,function(err, response, data) {
            res.send(JSON.parse(data));
        }
      )
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