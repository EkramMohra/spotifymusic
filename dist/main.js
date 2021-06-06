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

let client_id = '30264da956bb4d909269af1e165230a1';
let redirect_uri = 'https://spotify-musicplayer.herokuapp.com';

const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;

// Don't authorize if we have an access token already
if(accessToken == null || accessToken == "" || accessToken == undefined){
    window.location.replace(redirect);
}


$('.search-container').on('click', '#search', function() {
    let val = $('.input').val()
    let search_query = encodeURI(val);

    $.get(`search/${search_query}/${accessToken}`, (data) => {
          // Load our songs from Spotify into our page
          let num_of_tracks = data.tracks.items.length;
          let count = 0;
          const max_songs = 12;
          let Sources = [];
          
          while(count < max_songs && count < num_of_tracks){
            let id = data.tracks.items[count].id;
            let src_str = `https://open.spotify.com/embed/track/${id}`;
            Sources.push(src_str);
            count++;
          }

          render.render(Sources)
    })
})