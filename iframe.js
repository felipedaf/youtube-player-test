var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
const urlId = new URLSearchParams(window.location.search).get('id')


let player;
function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
    height: '720',
    width: '1280',
    videoId: urlId,
    playerVars: {
        controls: '0',
        enablejsapi: '1',
        showinfo: '0',
        loop: '1',
        modestbranding: '1',
        rel: '0',
        playlist: urlId
    },
    events: {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
    }
});
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        console.log(player.getCurrentTime())
    }
}