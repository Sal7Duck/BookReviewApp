//final
CREATE TABLE bookinfo (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    authors VARCHAR(255) ARRAY,
    description TEXT,
    categories VARCHAR(255) ARRAY,
    avg_rating FLOAT,
    ratings_count INTEGER,
    small_thumbnail_url VARCHAR(255),
    reviews TEXT ARRAY
);

CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    fav_books VARCHAR(255) []
);

