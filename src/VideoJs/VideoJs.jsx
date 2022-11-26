import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import VideoJsTag from './VideoJsTag'

export function VideoJS (props) {
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const {options, onReady} = props

  useEffect(() => {

    console.log('playerRef.current', playerRef.current)
    console.log('videoRef.current', videoRef.current)

    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {

      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js")

      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current.appendChild(videoElement)

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready')
        onReady && onReady(player)
      })

    // You could update an existing player in the `else` block here
    // on prop change, for example:
    } 
    else if (playerRef.current) {
      const player = playerRef.current

      player.autoplay(options.autoplay || false)
      player.src(options.sources || [])
    }
  }, [options, videoRef, onReady])


  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])


  return (
    <div data-vjs-player>
      <video-js ref={videoRef} />
    </div>
  )
}