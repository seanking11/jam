import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import firebase from 'firebase'

const Container = styled.div`
    display: grid;
    ${'' /* grid-gap: 1em; */}
    ${'' /* grid-auto-rows: minmax(100px); */}
`

const Bottom = styled.div`
    background-color: lightgrey;
`

const Top = styled.div`
    background-color: grey;
`

const TrackPanel = styled.input`
    height: 100px;
    background-color: darkgrey;
    ${'' /* display: flex;
    align-items: center;
    justify-content: center; */}
`

const TrackWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Track = ({ name: initialName, addNewTrack }) => {
    const [name, setName] = useState(initialName)
    const input = useRef(null)

    return (
        <TrackWrapper>
            <input
                type="text"
                placeholder="Track name"
                value={name}
                onChange={({ target: { value } }) => setName(value)}
            />
            <TrackPanel
                ref={input}
                onChange={addNewTrack}
                type="file"
                accept="video/*"
            />
            {/* <FontAwesomeIcon icon={faPlus} size="3x" onClick={click} /> */}
        </TrackWrapper>
    )
}

const Jam = () => {
    const videoRef = useRef(null)
    const input = useRef(null)
    const addNewTrack = (e) => {
        const file = input.current.files[0]
        const objUrl = window.URL.createObjectURL(file)
        videoRef.current.src = objUrl

        // Upload to firebase
        const storageRef = firebase.storage().ref()
        const clipRef = storageRef.child('clip.mp4')
        clipRef.put(file).then(function(snapshot) {
            console.log('Uploaded a blob or file!', snapshot)
        })
    }

    const click = () => {
        const files = videoRef.current.files
        console.log(files)
    }

    return (
        <Container>
            <Top>
                <input type="text" placeholder="Song title" />
                <video id="video" ref={videoRef} controls />
            </Top>

            <Bottom>
                <Track name="Lead Guitar" addNewTrack={addNewTrack} />
                <Track name="Rhythm Guitar" addNewTrack={addNewTrack} />
                <div onClick={click}>Add new track</div>
            </Bottom>
        </Container>
    )
}

export default Jam
