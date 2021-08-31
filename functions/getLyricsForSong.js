'use strict'

const cheerio = require('cheerio')
const fetch = require('node-fetch')

/**
 * @param {string} url - Genius URL
 */
const getLyricsFromGeniusUrl = async function(url) {
    const response = await fetch(url)
    const text = await response.text()
    const $ = cheerio.load(text)

    let lyrics = $('div.lyrics')
        .text()
        .trim()

    if (!lyrics) {
        lyrics = ''
        $('div[class^="Lyrics__Container"]').each((i, elem) => {
            if ($(elem).text().length !== 0) {
                let snippet = $(elem)
                    .html()
                    .replace(/<br>/g, '\n')
                    .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '')
                lyrics +=
                    $('<textarea/>')
                        .html(snippet)
                        .text()
                        .trim() + '\n\n'
            }
        })

        return lyrics
    }

    if (!lyrics) {
        return 'No lyrics found :('
    }

    return lyrics.trim()
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Example: https://genius.com/Green-day-longview-lyrics
module.exports = async function({ title, artist }) {
    const formattedArtist = capitalizeFirstLetter(artist.replace(/\s/g, '-'))
    const formattedTitle = title.replace(/\s/g, '-')
    const geniusUrl = `https://genius.com/${formattedArtist}-${formattedTitle}-lyrics`

    return getLyricsFromGeniusUrl(geniusUrl)
}
