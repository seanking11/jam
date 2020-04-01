const _ = require('lodash')
const moment = require('moment')

const isBetween = (timeToCheck, startTime, endTime) => {
    const timeFormat = 'mm:ss'
    const start = moment(startTime, timeFormat)
    const end = moment(endTime, timeFormat)

    const time = moment(timeToCheck, timeFormat)

    if (time.isBetween(start, end, 'seconds', '[)')) {
        return true
    }

    return false
}

const pad = (num) => ('0' + num).slice(-2)
const secondsToMinutes = (seconds) => {
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    // let hours = Math.floor(minutes / 60)
    minutes = minutes % 60
    return `${pad(minutes)}:${pad(seconds)}`
    // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

const deriveActiveStatusForClips = (clips, timeToMatch) => {
    _.each(clips, (clip) => {
        const active = clip.startAt === timeToMatch
        clip.active = active
    })

    return clips
}

export default class Player {
    constructor(props) {
        this.time = '00:00'
        this.seconds = 0
        this.allClips = deriveActiveStatusForClips(props.clips, this.time)
        this.incrementSeconds = props.incrementSeconds

        console.log('player', this)
    }

    play() {
        const activeClips = _.filter(
            this.allClips,
            (clip) => clip.active === true
        )
        _.each(activeClips, (clip) => {
            clip.videoRef.current.play()
        })

        this._startTimer()
    }

    pause() {
        const activeClips = _.filter(
            this.allClips,
            (clip) => clip.active === true
        )
        _.each(activeClips, (clip) => {
            clip.videoRef.current.pause()
        })

        this._stopTimer()
    }

    seek(newTime) {
        this.time = newTime
        this._updateActiveClips({ shouldPlay: true })
    }

    restart() {
        this.seek(0)
    }

    _incrementTime(self) {
        self.seconds = this.seconds + 1
        self.time = secondsToMinutes(this.seconds)
        self._updateActiveClips({ shouldPlay: true })
        self.incrementSeconds(this.seconds)
        console.log('tick', this)
    }

    _startTimer() {
        this.timer = setInterval(() => this._incrementTime(this), 1000)
    }

    _stopTimer() {
        clearInterval(this.timer)
    }

    _toggleActiveClip(clipId, isActive) {
        const clip = _.find(this.allClips, (clip) => clip.clipId === clipId)
        clip.active = isActive
    }

    _updateActiveClips({ shouldPlay }) {
        // TODO: Use isBetween to determine the active clips, if the current time is past the endAt of a song,
        // currently, it will start playing it when it should not be considered active.
        const clipsToPlay = _.filter(
            this.allClips,
            (clip) => clip.startAt === this.time
        )

        _.each(clipsToPlay, (clip) => {
            this._toggleActiveClip(clip.clipId, true)
            if (shouldPlay) {
                clip.videoRef.current.play()
            }
        })

        const clipsToStop = _.filter(
            this.allClips,
            (clip) => clip.endAt === this.time
        )

        _.each(clipsToStop, (clip) => {
            this._toggleActiveClip(clip.id, false)
        })

        return [clipsToPlay, clipsToStop]
    }
}
