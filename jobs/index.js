const fg = require('fast-glob')
const path = require('path')

module.exports = () => {
  const jobs = fg.sync('jobs/*.js', {
    ignore: ['**/*/index.js'],
    absolute: true
  })

  jobs.forEach(jobPath => {
    const { name } = path.parse(jobPath)
    require(jobPath)()
    console.log(`Job [${name}] started`)
  })
}
