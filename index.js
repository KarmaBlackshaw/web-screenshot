require('dotenv').config()

const Koa = require('koa')
const Router = require('@koa/router')
const mime = require('mime-types')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const Joi = require('joi')

// jobs
const jobs = require('./jobs')

const { screenshotPage } = require('./helpers')

const app = new Koa()
const router = new Router()

router.get('/', async (ctx, next) => {
  const schema = Joi.object({
    url: Joi.string()
      .optional(),
    quality: Joi.number()
      .optional(),
    width: Joi.number()
      .optional(),
    height: Joi.number()
      .optional(),
    timeout: Joi.number()
      .optional(),
    fullPage: Joi.number()
      .optional()
  })

  const data = await schema.validateAsync(ctx.request.query)

  const path = await screenshotPage({
    url: data.url,
    quality: data.quality,
    width: data.width,
    height: data.height,
    timeout: data.timeout,
    fullPage: data.fullPage
  })

  const mimeType = mime.lookup(path)

  const src = fs.createReadStream(path)

  ctx.response.set('content-type', mimeType)

  ctx.body = src

  ctx.status = 200
})

jobs()

app
  .use(router.routes())
  .listen(process.env.PORT)

console.log(`App running in port http://localhost:${process.env.PORT}`)
