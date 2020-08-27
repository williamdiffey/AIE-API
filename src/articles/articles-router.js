const express = require('express')
const ArticlesService = require('./articles-service')
const AuthService = require('../auth/auth-service')
const UsersService = require('../users/users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const articlesRouter = express.Router()
const jsonBodyParser = express.json()

articlesRouter.post('/newpost', jsonBodyParser, (req, res, next) => {
  const { title, content, style, author_id } = req.body

  for (const field of ['title', 'content', 'style', 'author_id'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      })

  const newArticle = {
    title,
    content,
    style,
    author_id,
    date_created: 'now()',
  }

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
})

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
