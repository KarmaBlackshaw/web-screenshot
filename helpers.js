const puppeteer = require('puppeteer')
const _ = require('lodash')
const path = require('path')
const { getUnixTime, add } = require('date-fns')

function makeUniq (str = '') {
  return str + Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function sleep (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function autoScroll (page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0
      const distance = 100
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

async function screenshotPage (_options) {
  const options = _.defaults(_options, {
    width: 1182,
    height: 885,
    timeout: 1000,
    quality: 100,
    fullPage: true,
    name: getUnixTime(add(new Date(), {
      days: 1
    }))
  })

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: options.width,
      height: 885
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  const page = await browser.newPage()

  await page.goto(options.url, {
    waitUntil: 'domcontentloaded'
  })

  await sleep(options.timeout)

  await autoScroll(page)

  const imagePath = path.join(process.cwd(), 'public', `${options.name}.jpeg`)

  await page.screenshot({
    path: imagePath,
    fullPage: options.fullPage,
    quality: options.quality
  })

  await page.close()

  return imagePath
}

module.exports = {
  makeUniq,
  sleep,
  screenshotPage
}
