const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const SongListSchema=new Schema({
    artist:String,
    song:String,
    audio:String
})

const SongList = mongoose.model("SongList",SongListSchema);
module.exports = SongList;