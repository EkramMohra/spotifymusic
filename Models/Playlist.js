const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const SongListSchema = new Schema({
    id: String,
    artist:String,
    songName:String,
    src:String
})

const SongList = mongoose.model("SongList",SongListSchema);

module.exports = SongList;