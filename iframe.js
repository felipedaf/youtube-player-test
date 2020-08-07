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
    }
    );
    const timeline = document.querySelector("#timeline")
    const confirm = document.querySelector("#confirm")
    const limiterRight = document.querySelector('#limiter__right')
    const limiterLeft = document.querySelector('#limiter__left')
    const limiterWrapper = document.querySelector('#limiter__wrapper')

    
    let limiterLeftSelected = false
    let limiterRightSelected = false
    let limiterMoving = false
    
    limiterRight.onmousedown = e => {
      if(!limiterRightSelected) {
        limiterRightSelected = true
      }
    }
    
    limiterLeft.onmousedown = e => {
      if(!limiterLeftSelected) {
        limiterLeftSelected = true
      }
    }
    
    document.onmousemove = e => {
      if(limiterRightSelected) {
        limiterMoving = true
        limiterWrapper.style.width = `${e.clientX - limiterWrapper.offsetLeft}px`
      }
      if(limiterLeftSelected) {
        limiterMoving = true
        const timelineSize = timeline.offsetWidth
        const marginSize = limiterLeft.offsetLeft - timeline.offsetLeft
        const difference = e.clientX - limiterWrapper.offsetLeft
        if(marginSize + difference > 0)
          limiterLeft.style.marginLeft = `${difference}px`

      }
    }

    document.onmouseup = e => {
      if(limiterRightSelected || limiterLeftSelected) {
        limiterRightSelected = false
        limiterLeftSelected = false
        setTimeout(() => {limiterMoving = false}, 10)
      }

    }

    let timebarChange;

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            timebarChange = setInterval(() => {
                trackerGoTo(player, player.getCurrentTime())
                startTimeGoTo(player, player.getCurrentTime())
            }, 100)
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
        if (event.data !== YT.PlayerState.PLAYING)
            clearInterval(timebarChange)

    }

    const clickedTime = (player, event) => {
        const positionClicked = event.clientX - timeline.offsetLeft
        const localPercent = positionClicked / timeline.clientWidth
        return player.getDuration() * localPercent
    }

    const startTimeGoTo = (player, time) => {
        const timeline = document.querySelector("#timeline")
        const startTime = document.querySelector("#start-time")
        const startMovingWidth = startTime.offsetWidth / 2
        const percentage = time / player.getDuration()
        const position = timeline.clientWidth * percentage
        const finalWidth = (timeline.offsetWidth - startMovingWidth)
        const endTime = document.querySelector("#end-time")
        
        startTime.innerHTML = userTimeFormat(time)

        if (finalWidth - (2 * startMovingWidth) <= position)
            endTime.style.opacity = "0"
        else
            endTime.style.opacity = "100%"

        if (finalWidth <= position) {
            startTime.style.left = `${finalWidth - startMovingWidth}px`
        }
        else if(position > startMovingWidth) {
            startTime.style.left = `${position - startMovingWidth}px`
        }
        else if(position <= startMovingWidth) {
            startTime.style.left = `0px`
        }
    } 

    const trackerGoTo = (player, time) => {
        const tracker = document.querySelector("#tracker")
        const percentage = time / player.getDuration()
        const position = timeline.clientWidth * percentage
        tracker.style.left = `${position - 1}px`
    }

    timeline.onclick = event => {
      if((!limiterRightSelected || !limiterRightSelected) && !limiterMoving) {
        clearInterval(timebarChange)
        const time = clickedTime(player, event)
        trackerGoTo(player, time)
        startTimeGoTo(player, time)
        player.seekTo(time)
      }
    }

    confirm.onclick = event => {
        event.preventDefault()
        const youtubeId = document.querySelector("#youtube-id").value
        document.location = `index.html?id=${youtubeId}`
    }
    playButton = document.querySelector("#play")
    const muteButton = document.querySelector("#mute-button")
    
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

const onPlayerReady = event => {
    const videoDuration = event.target.playerInfo.duration
    const startTime = document.querySelector("#start-time")
    startTime.innerHTML = '00:00:00'
    document.querySelector("#end-time").innerHTML = userTimeFormat(videoDuration)
}

const userTimeFormat = time => {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor((time / 60) % 60)
    const hours = Math.floor(time / (60 * 60))
    const finalTime = `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}`
    return finalTime
    
}