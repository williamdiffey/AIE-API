CREATE TABLE aie_regcodes (
  regcode TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
