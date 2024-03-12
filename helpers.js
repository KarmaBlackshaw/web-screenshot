const puppeteer = require('puppeteer')
const _ = require('lodash')

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
    fullPage: false,
    name: makeUniq()
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

  const path = `./public/${options.name}.jpeg`
  await page.screenshot({
    path,
    fullPage: options.fullPage,
    quality: options.quality
  })

  await page.close()

  return path
}

module.exports = {
  makeUniq,
  sleep,
  screenshotPage
}
