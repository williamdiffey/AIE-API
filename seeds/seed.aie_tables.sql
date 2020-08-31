BEGIN;

TRUNCATE
  aie_comments,
  aie_articles,
  aie_users
  RESTART IDENTITY CASCADE;

INSERT INTO aie_users (user_name, regcode, admin, password)
VALUES
  ('Teacher Dave', 'a43ga4dfcv', true, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('Jason', '12345', true, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('Ann', '67890', true, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('Terry', '9876', true, '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('Kim', '5432', false, '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO');
  
INSERT INTO aie_articles (title, style, author_id, content)
VALUES
  ('Wednesday homework', 'Grammar', 1,
    'A quick review of the past tense we studied today! Tell me about 5 things you did yesterday using these words (you will have to change them to the past tense): eat, sleep, drink, go, meet, watch'),
  ('Weekend assignment', 'Story', 1,
    'Tell me about a time you went to another country on holiday. Write no less than 5 sentences please!');
  
INSERT INTO aie_comments (
  text,
  article_id,
  user_id
) VALUES
  (
    'I went to the school, I ate a chocolate, I slept a lot, I met my friends in park, I did not watch TV',
    1,
    2
  ),
  (
    'I went cinema, I ate chicken, I slept at 11pm, I met my cousins, I watched a movie at the cinema',
    1,
    3
  ),
  (
    'I went home, I slept, I did not meet my friends, I did not watch TV, I ate rice',
    1,
    4
  ),
  (
    'I went to grandmothers house, I slept late, I watched Korean drama, I ate Kim Chi',
    1,
    5
  ),
  (
    'Last year I went to Vietnam - Da Nang with my family. We stayed in a hotel next to the sea. We went to Hoi An and bought clothes. I went swimming everyday. We ate lots of Vietnamese food. My brother got sunburn. ',
    2,
    6
  );

COMMIT;
