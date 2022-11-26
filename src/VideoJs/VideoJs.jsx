// @ts-check

import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import VideoJsTag from './VideoJsTag'

/**
 * @typedef {import('video.js').VideoJsPlayerOptions} VideoJsPlayerOptions
 * @typedef {import('video.js').VideoJsPlayer} VideoJsPlayer
 * @typedef {React.MutableRefObject<HTMLVideoElement | null>} HTMLVideoElementRef
 * @typedef {React.MutableRefObject<VideoJsPlayer | null>} VideoJsPlayerRef
 * 
 * 
 * @typedef {Object} VideoJsProps
 * @property {VideoJsPlayerOptions} VideoJsProps.options
 * @property {(VideoJsPlayer) => void} VideoJsProps.onReady
 */

/** @param {VideoJsProps} props */
export function VideoJS (props) {

  /** @type {HTMLVideoElementRef} */
  const videoRef = useRef(null)

  /** @type {VideoJsPlayerRef} */
  const playerRef = useRef(null)

  const {options, onReady} = props

  useEffect(() => {

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
      <VideoJsTag htmlRef={videoRef} />
    </div>
  )
}