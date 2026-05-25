# Book Notes

A personal book notes website for storing reviews and ratings of books I have read. The app displays each book with its title, author, review, rating, review date, and a cover image fetched from the Open Library Covers API.

## Features

- View all saved book reviews
- Search reviews by book title or author
- Sort reviews by recency, title, or author
- Edit an existing review and rating
- Delete reviews
- Display star ratings using Bootstrap Icons
- Fetch book cover images from Open Library

## Tech Stack

- Node.js
- Express.js
- EJS
- PostgreSQL
- Bootstrap
- Bootstrap Icons
- Axios

## Project Structure

```text
.
|-- index.js
|-- package.json
|-- public/
|   `-- styles/
|       |-- main.css
|       `-- edit.css
`-- views/
    |-- index.ejs
    |-- edit.ejs
    `-- partials/
        |-- header.ejs
        `-- footer.ejs
```

## Getting Started

### Prerequisites

Make sure you have these installed:

- Node.js
- npm
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd <repository-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a PostgreSQL database named `BookNotes`.

4. Create the `reviews` table:

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  review TEXT,
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Add sample data if needed:

```sql
INSERT INTO reviews (title, author, review, rating)
VALUES
('Atomic Habits', 'James Clear', 'A practical book about building better habits through small changes.', 5),
('The Alchemist', 'Paulo Coelho', 'A short and reflective story about dreams, purpose, and persistence.', 4);
```

6. Update the PostgreSQL credentials in `index.js` if your local database credentials are different:

```js
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BookNotes",
  password: "1234",
  port: 5432,
});
```

7. Start the server:

```bash
node index.js
```

8. Open the app in your browser:

```text
http://localhost:3000
```

## Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Display all book reviews |
| POST | `/search` | Search reviews by title or author |
| POST | `/home` | Clear search and return to all reviews |
| POST | `/sort` | Sort reviews by recency, title, or author |
| GET | `/edit/:id` | Show the edit page for a review |
| POST | `/edit/:id` | Update a review and rating |
| POST | `/delete/:id` | Delete a review |

## Notes

- Book covers are fetched from Open Library using the book title.
- The app currently uses local PostgreSQL credentials directly in `index.js`. For deployment or shared development, move these values into environment variables.
- There is no add-book form yet, so new records must be inserted directly into the database unless that feature is added later.
