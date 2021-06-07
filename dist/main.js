const render = new Renderer()

const getUrlParameter = (sParam) => {
    let sPageURL = window.location.search.substring(1),
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

let client_id = '40ad47ff664944cbb3ebcbca122685bf';
let redirect_uri = 'http://localhost:3500';

const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;

if(accessToken == null || accessToken == "" || accessToken == undefined){
    window.location.replace(redirect);
}

let Sources = [];

$('.search-container').on('click', '#search', function() {
    let val = $('.input').val()

    $.get(`search/${val}/${accessToken}`,async (data) =>  {
          let num_of_tracks = data.tracks.items.length;
          let count = 0;
          const max_songs = 15;
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
            count++;
          }
          render.render(Sources, '.container')
    })
})

let newR = []
$('#newRelease').on('click', function() {
    let on = 'fas fa-toggle-on fa-2x'
    let off = 'fas fa-toggle-off fa-2x'
    let c = $(this).attr('class')
    if(c === on){
        $(this).removeClass()
        $(this).addClass('fas fa-toggle-off fa-2x') 
        render.render([], '.newReleases')
    }else{
        $(this).removeClass()
        $(this).addClass('fas fa-toggle-on fa-2x')
        $.get(`new/${accessToken}`, async(data) =>  {
            let num_of_tracks = data.albums.items.length;
            let count = 0;
            let id = data.albums.items[count].id;
            let src_str = `https://open.spotify.com/embed/album/${id}`
            newR = []
    
            while(count < num_of_tracks){
                let id = data.albums.items[count].id;
                let songName = data.albums.items[count].name
                let artistName = data.albums.items[count].artists[0].name
                let src_str = `https://open.spotify.com/embed/album/${id}`
                let isAdded = false
                await $.get(`isAdded/${id}`, function(bool){
                    if(bool)
                    {
                        newR.push({id:id, artist:artistName, songName:songName, src:src_str,isAdded: true});
                    }
                    else{
                         newR.push({id:id, artist:artistName, songName:songName, src:src_str,isAdded: false});
                    }
                })
                count++;
            }
            render.render(newR, '.newReleases')
        }) 
    }
})


$('#horizontal-list > li').on('click', function(){
    let type = $(this).text()
   
    $.get(`/gener/${type}/${accessToken}`, async(data) =>  {
        let num_of_tracks = data.playlists.items.length;
        let count = 0;
        let id = data.playlists.items[count].id;
        let src_str = `https://open.spotify.com/embed/album/${id}`
        Sources = []

        while(count < num_of_tracks){
            let id = data.playlists.items[count].id;
            let songName = data.playlists.items[count].name
            let artistName = data.playlists.items[count].owner.display_name
            let src_str = `https://open.spotify.com/embed/playlist/${id}`
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
            count++;
        }
        render.render(Sources, '.container')
    })
})

$('div').on('click', '#addToDB', function() {
    let divName = $(this).closest('.song')
    let id=divName.find('iframe').attr("id")
    
    if(divName.parent().attr('class')==='container'){
        let song = Sources.find(element => element.id === id)
        let check = song.isAdded
        if(!check){
            $.post("/saveSong", song, function(data){
                Sources.find(element => element.id === id).isAdded = true
                render.render(Sources, '.container');
            })
        }
    }
    else{
        let song = newR.find(element => element.id === id)
        let check = song.isAdded
        if(!check){
            $.post("/saveSong", song, function(data){
                newR.find(element => element.id === id).isAdded = true
                render.render(newR, '.newReleases');
            })
        }
    }
})

$('div').on('click', '#delfromDB', function() {
    let divName = $(this).closest('.song')
    let id=divName.find('iframe').attr("id")

if(divName.parent().attr('class')==='container'){
        let song = Sources.find(element => element.id === id)
        let check = song.isAdded

    if(check){
        $.ajax({
            method:"delete",
            url:'/delFromDb/'+id,
            success:function (result){
                console.log('item deleted');
                Sources.find(element => element.id === id).isAdded = false
                render.render(Sources, '.container');
            }
        })
    }
}
else{
    let song = newR.find(element => element.id === id)
    let check = song.isAdded
    if(check){
        $.ajax({
            method:"delete",
            url:'/delFromDb/'+id,
            success:function (result){
                console.log('item deleted');
                newR.find(element => element.id === id).isAdded = false
                render.render(newR, '.newReleases');
            }
        })
    }
}
})

$('#dark').on('click', function() {
    let on = 'fas fa-adjust fa-2x'
    let off = "fas fa-sun fa-2x"

    let c = $(this).attr('class')

    if (c === off) {
        $(this).removeClass()
        $(this).addClass(on)
        $(this).css("color","white")
        $('body').css("background-color", "black");
        $('body').css("color", "white");
    } else {
        $(this).removeClass()
        $(this).addClass(off)
        $(this).css("color","black")
        $('body').css("background-color", "white");
        $('body').css("color", "black");
    }
})

$('.container').on('click', '.myplaylist', function(){
    $.get('/playlist', function(playlist){
        Sources = []
        Sources = Object.values(playlist)
        Sources = Sources.map(elem=>{return{id:elem.id,src:elem.src,isAdded:true}})

        render.render(Sources, '.container')
    })
})