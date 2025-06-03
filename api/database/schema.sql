PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS classifications (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL UNIQUE
  category TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS log_entries (
  id INTEGER PRIMARY KEY,
  site_id INTEGER NOT NULL,
  timestamp INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  FOREIGN KEY (site_id) REFERENCES classifications(id)
)