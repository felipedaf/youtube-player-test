var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
const urlId = new URLSearchParams(window.location.search).get('id')


let player;
let playButton;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '720',
        width: '1280',
        videoId: urlId,
        playerVars: {
            fs: '0',
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
    
    const confirm = document.querySelector("#confirm")
    confirm.onclick = event => {
        event.preventDefault()
        const youtubeId = document.querySelector("#youtube-id").value
        document.location = `index.html?id=${youtubeId}`
    }
    playButton = document.querySelector("#play")
    
    const back = document.querySelector("#back")
    const advance = document.querySelector("#advance")
    const muteButton = document.querySelector("#mute-button")
    
    back.onclick = event => {
        event.preventDefault()
        player.seekTo(player.getCurrentTime() - 10, true)
    }
    
    advance.onclick = event => {
        event.preventDefault()
        player.seekTo(player.getCurrentTime() + 10, true)
    }
    
    muteButton.onclick = event => {
        event.preventDefault()
        let muted = player.isMuted()
        if (muted) {
            player.unMute()
            muteButton.value = "mute"
        }
        else {
            player.mute()
            muteButton.value = "unmute"
        }
    }
}

function onPlayerReady(event) {
    const videoDuration = event.target.playerInfo.duration
    const seconds = Math.floor(videoDuration % 60)
    const minutes = Math.floor((videoDuration / 60) % 60)
    const hours = Math.floor(videoDuration / (60 * 60))
    const finalTime = `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}`
    document.querySelector("#start-time").innerHTML = '00:00:00'
    document.querySelector("#end-time").innerHTML = finalTime
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        playButton.onclick = () => {
            player.pauseVideo()
        }
        playButton.value = "||"
    }
    if (event.data == YT.PlayerState.PAUSED || event.data == -1) {
        playButton.onclick = () => {
            player.playVideo()
        }
        playButton.value = "►"
    }
}
