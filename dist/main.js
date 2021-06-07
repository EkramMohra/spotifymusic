// const { deleteMany } = require("../Models/Playlist");

const render = new Renderer()

//extract access_token from url
const getUrlParameter = (sParam) => {
    let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
        sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [], sParameterName, i;
    let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
    sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}
const accessToken = getUrlParameter('access_token');

let client_id = 'b70e947c7333404b8023de1203d701b7';
let redirect_uri = 'http://localhost:3500';

const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;

// Don't authorize if we have an access token already
if(accessToken == null || accessToken == "" || accessToken == undefined){
    window.location.replace(redirect);
}

let Sources = [];

$('.search-container').on('click', '#search', function() {
    let val = $('.input').val()

    $.get(`search/${val}/${accessToken}`,async (data) =>  {
          // Load our songs from Spotify into our page
          let num_of_tracks = data.tracks.items.length;
          let count = 0;
          const max_songs = 12;
          Sources = []

          while(count < max_songs && count < num_of_tracks){
            let id = data.tracks.items[count].id;
            let songName = data.tracks.items[count].name
            let artistName = data.tracks.items[count].artists[0].name
            let src_str = `https://open.spotify.com/embed/track/${id}`
            let isAdded = false
            await $.get(`isAdded/${id}`, function(bool){
                if(bool)
                {
                    Sources.push({id:id, artist:artistName, songName:songName, src:src_str,isAdded: true});
                }
                else{
                     Sources.push({id:id, artist:artistName, songName:songName, src:src_str,isAdded: false});
                }
            })
            // Sources.push({id:id, artist:artistName, songName:songName, src:src_str,isAdded: isAdded});
            count++;
          }
          render.render(Sources)
    })
})

$('div').on('click', '#addToDB', function() {
    let id = $(this).closest('.song').find('iframe').data().id
    let song = Sources.find(element => element.id === id)
    let check = song.isAdded

    if(!check){
        $.post("/saveSong", song, function(data){
            Sources.find(element => element.id === id).isAdded = true
            render.render(Sources)
        })
    }
})

$('div').on('click', '#delfromDB', function() {
    let id = $(this).closest('.song').find('iframe').data().id
    let song = Sources.find(element => element.id === id)
    let check = song.isAdded

    if(check){
        $.ajax({
            method:"delete",
            url:'/delFromDb/'+id,
            success:function (result){
                console.log('item deleted');
                Sources.find(element => element.id === id).isAdded = false
                render.render(Sources);
            }
        })
    }
})