const render = new Renderer()

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
    // Use the following site to convert your regular url to the encoded version:
    // https://www.url-encode-decode.com/
    let redirect_uri = 'https://spotify-musicplayer.herokuapp.com';
    // *************** END *************************

    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    // Don't authorize if we have an access token already
    if(accessToken == null || accessToken == "" || accessToken == undefined){
      window.location.replace(redirect);
    }
//logic

let arr=[];
$('.search-container').on('click', '#search', function() {
    let val = $('.input').val()
    let search_query = encodeURI(val);

    $.get(`search/${search_query}/${accessToken}`, (data) => {
          // Load our songs from Spotify into our page
          let num_of_tracks = data.tracks.items.length;
          let count = 0;
          // Max number of songs is 12
          const max_songs = 12;
          while(count < max_songs && count < num_of_tracks){
            // Extract the id of the FIRST song from the data object
            let id = data.tracks.items[count].id;
            // Constructing two different iframes to embed the song
            let src_str = `https://open.spotify.com/embed/track/${id}`;
            arr.push(src_str);
            // let iframe = `<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;

            // $('.container').append(iframe);
            count++;
          }

          render.render(arr)
    })
})