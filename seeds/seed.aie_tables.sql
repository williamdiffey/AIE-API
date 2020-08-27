BEGIN;

TRUNCATE
  aie_comments,
  aie_articles,
  aie_users
  RESTART IDENTITY CASCADE;

INSERT INTO aie_users (user_name, full_name, admin, password)
VALUES
  ('Big Dave', 'Dave Davis', false, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('Nice Guy Kev', 'Kevin Kevins', true, '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO');
  
INSERT INTO aie_articles (title, style, author_id, content)
VALUES
  ('First post!', 'Grammar', 1,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?'),
  ('Second post!', 'Story', 2,
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.');
  
INSERT INTO aie_comments (
  text,
  article_id,
  user_id
) VALUES
  (
    'This post is amazing',
    1,
    2
  ),
  (
    'Yeh I agree it''s amazing',
    1,
    1
  ),
  (
    'I would go so far as to say it''s double amazing',
    1,
    2
  ),
  (
    'A-mazing!',
    1,
    1
  ),
  (
    'That''s some interesting lorems you raise',
    2,
    1
  ),
  (
    'Yeh totally I''d never thought about lorems like that before',
    2,
    2
  ),
  (
    'So you''re saying consectetur adipisicing elit?',
    2,
    1
  );

COMMIT;
