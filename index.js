const puppeteer = require('puppeteer')

const { makeUniq, sleep } = require('./helpers')

async function screenshotPage (_options) {
  const options = Object.assign({
    width: 1182,
    height: 885,
    timeout: 1000,
    quality: 50
  }, _options)

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1182,
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

  const path = `./public/${makeUniq()}.jpeg`
  await page.screenshot({
    path,
    quality: options.quality
  })

  await page.close()

  return path
}

screenshotPage({
  url: 'https://jeash.tech',
  quality: 2
})
