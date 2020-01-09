import React, { useEffect, useRef, useState } from 'react';
import { VideoRecorder as ReactVideoRecorder } from 'react-video-recorder'

import '../App.css';

const mediaConstraints = {
  audio: true,
  video: {
    width: { min: 1280 },
    height: { min: 720 }
  }
}

// Get an extension that allows you to write arrow functions, normal functions, objects, etc.

const VideoRecorder = () => {
  const videoRef = useRef(null)
  const playbackVideoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [recorder, setRecorder] = useState(null) 
  const [playbackUrl, setPlaybackUrl] = useState(null) 

  useEffect(() => {
    const getAndSetStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)

      videoRef.current.srcObject = stream
      setStream(stream)
      console.log('set stream', stream)
    }
    getAndSetStream()
  }, [])

  const handleRecord = (e) => {
    e.preventDefault()
    
    const mediaRecorder = new MediaRecorder(stream)
    // mediaRecorder.ondataavailable = (e) => {
    //   console.log('blob?', e)
    //   const url = window.URL.createObjectURL(e.data)
    //   setPlaybackUrl(url)
    //   // playbackVideoRef.current.srcObject = url
    // }

    setRecorder(mediaRecorder)
    mediaRecorder.start()
  }

  const handleStop = () => {
    console.log(recorder)
    const blob = recorder.requestData()
    console.log(blob)

    // Don't stop more than once
    recorder.stop()
    
  }

  const onRecordingComplete = videoBlob => {
    const videoUrl = window.URL.createObjectURL(videoBlob)
    playbackVideoRef.current.srcObject = videoUrl
  }

  return (
    <div className="App">
      <video
        id='video'
        autoPlay
        ref={ videoRef }
      >
      </video>
      <video
        id='video1'
        autoPlay
        ref={ playbackVideoRef }
        src={ playbackUrl }
      >
      </video>

      <hr />

      <ReactVideoRecorder
        onRecordingComplete={onRecordingComplete}
      />

      <button onClick={handleRecord}>Record!</button>
      <button onClick={handleStop}>Stop!</button>
    </div>
  );
}

export default VideoRecorder
