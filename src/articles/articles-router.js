const express = require('express')
const ArticlesService = require('./articles-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { escapeAttrValue } = require('xss')

const articlesRouter = express.Router()
const jsonBodyParser = express.json()

articlesRouter.post(
  '/newarticle',
  requireAuth,
  jsonBodyParser,
  (req, res, next) => {
    const { title, content, style } = req.body
    const author_id = req.user.id
    const admin = req.user.admin

    if (admin !== true)
      return res
        .status(404)
        .json({ error: `You must be logged in as an admin to add new posts` })

    for (const field of ['title', 'content', 'style'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })

    // console.log(req.user_id)
    const newArticle = {
      title,
      content,
      style,
      author_id,
      date_created: 'now()',
    }
    console.log(`newArticle is ${newArticle}`)

    return ArticlesService.insertArticle(req.app.get('db'), newArticle)
      .then((article) => {
        res.status(201).json({
          message: `success`,
        })
        // posix to create consistent paths across different OS
        // .location(path.posix.join(req.originalUrl, `/${article.id}`))
        // .json(articlesService.serializeArticle(article))
      })

      .catch(next)
  },
)

articlesRouter.route('/').get((req, res, next) => {
  ArticlesService.getAllArticles(req.app.get('db'))
    .then((articles) => {
      res.json(articles.map(ArticlesService.serializeArticle))
    })
    .catch(next)
})

articlesRouter
  .route('/:article_id')
  .all(requireAuth)
  .all(checkArticleExists)
  .get((req, res) => {
    res.json(ArticlesService.serializeArticle(res.article))
  })

articlesRouter
  .route('/:article_id/comments/')
  .all(requireAuth)
  .all(checkArticleExists)
  .get((req, res, next) => {
    ArticlesService.getCommentsForArticle(
      req.app.get('db'),
      req.params.article_id,
    )
      .then((comments) => {
        res.json(comments.map(ArticlesService.serializeArticleComment))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkArticleExists(req, res, next) {
  try {
    const article = await ArticlesService.getById(
      req.app.get('db'),
      req.params.article_id,
    )

    if (!article)
      return res.status(404).json({
        error: `Article doesn't exist`,
      })

    res.article = article
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = articlesRouter
