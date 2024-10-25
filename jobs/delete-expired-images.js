const fs = require('fs')
const path = require('path')
const fg = require('fast-glob')
const { getUnixTime } = require('date-fns')

async function pollDeleteExpired (dir, interval) {
  const files = fg.sync('public/*.jpeg', {
    absolute: true
  })

  files.forEach(async file => {
    const { name } = path.parse(file)
    const fileTimestamp = Number(name)

    if (isNaN(fileTimestamp)) {
      return
    }

    if (getUnixTime(new Date()) < fileTimestamp) {
      return
    }

    await fs.unlinkAsync(file)
  })
}

module.exports = () => {
  pollDeleteExpired()
  setInterval(() => {
    pollDeleteExpired()
  }, 5000)
}
