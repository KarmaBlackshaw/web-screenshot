
const Koa = require('koa')
const Router = require('@koa/router')
const mime = require('mime-types')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const Joi = require('joi')

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
      .optional()
  })

  const data = await schema.validateAsync(ctx.request.query)

  const path = await screenshotPage({
    url: data.url,
    quality: data.quality,
    width: data.width,
    height: data.height,
    timeout: data.timeout
  })

  const mimeType = mime.lookup(path)

  const src = fs.createReadStream(path)

  ctx.response.set('content-type', mimeType)

  ctx.body = src

  await fs.unlinkAsync(path)
})

app
  .use(router.routes())
  .listen(8000)
