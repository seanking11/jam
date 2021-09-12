const pad = (num) => ('0' + num).slice(-2)

function msToHumanReadable(ms) {
    if (!ms) {
        return ''
    }

    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / 1000 / 60) % 60)
    const hours = Math.floor((ms / 1000 / 3600) % 24)

    const humanized = [
        pad(hours.toString(), 2),
        pad(minutes.toString(), 2),
        pad(seconds.toString(), 2),
    ].join(':')

    return humanized
}

export default msToHumanReadable
