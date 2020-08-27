CREATE TYPE article_category AS ENUM (
  'Grammar',
  'Vocabulary',
  'Chat',
  'Story'
);

ALTER TABLE aie_articles
  ADD COLUMN
    style article_category;
