const xss = require('xss')

const ArticlesService = {
  getAllArticles(db) {
    return db
      .from('aie_articles AS art')
      .select(
        'art.id',
        'art.title',
        'art.date_created',
        'art.style',
        'art.content',
        db.raw(`count(DISTINCT comm) AS number_of_comments`),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'regcode', usr.regcode,
              'admin', usr.admin,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`,
        ),
      )
      .leftJoin('aie_comments AS comm', 'art.id', 'comm.article_id')
      .leftJoin('aie_users AS usr', 'art.author_id', 'usr.id')
      .groupBy('art.id', 'usr.id')
  },

  getById(db, id) {
    return ArticlesService.getAllArticles(db).where('art.id', id).first()
  },

  getCommentsForArticle(db, article_id) {
    return db
      .from('aie_comments AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.regcode,
                  usr.admin,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`,
        ),
      )
      .where('comm.article_id', article_id)
      .leftJoin('aie_users AS usr', 'comm.user_id', 'usr.id')
      .groupBy('comm.id', 'usr.id')
  },

  serializeArticle(article) {
    const { author } = article
    return {
      id: article.id,
      style: article.style,
      title: xss(article.title),
      content: xss(article.content),
      date_created: new Date(article.date_created),
      number_of_comments: Number(article.number_of_comments) || 0,
      author: {
        id: author.id,
        user_name: author.user_name,
        regcode: author.regcode,
        admin: author.admin,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null,
      },
    }
  },

  serializeArticleComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      article_id: comment.article_id,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        regcode: user.regcode,
        admin: user.admin,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null,
      },
    }
  },

  insertArticle(db, newArticle) {
    return db
      .insert(newArticle)
      .into('aie_articles')
      .returning('*')
      .then(([article]) => article)
  },
}

module.exports = ArticlesService
