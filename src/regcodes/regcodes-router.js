const express = require('express')
const RegcodesService = require('./regcodes-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const regcodesRouter = express.Router()
const jsonBodyParser = express.json()

regcodesRouter.post(
  '/newregcode',
  //   requireAuth,
  jsonBodyParser,
  (req, res, next) => {
    const { regcode } = req.body
    // const admin = req.user.admin
    const admin = true

    if (admin !== true)
      return res
        .status(404)
        .json({ error: `You must be logged in as an admin to add new codes` })

    for (const field of ['regcode'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })

    // console.log(req.user_id)
    const newRegcode = {
      regcode,
      date_created: 'now()',
    }
    console.log(`newRegcode is ${newRegcode}`)

    return RegcodesService.insertRegcode(req.app.get('db'), newRegcode)
      .then((regcode) => {
        res.status(201).json({
          message: `success, new registration code added`,
        })
        // posix to create consistent paths across different OS
        // .location(path.posix.join(req.originalUrl, `/${article.id}`))
        // .json(articlesService.serializeArticle(article))
      })

      .catch(next)
  },
)

module.exports = regcodesRouter
