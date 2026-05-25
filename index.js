import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const port = 3000;
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BookNotes",
  password: "1234",
  port: 5432,
});

db.connect();

async function getCovers(data) {
  let covers = [];
  
  for (let book of data) {
    let x = 0;
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${book.title}&lang=eng&fields=author_key,title,author_name,cover_edition_key`,
      );
      const response_result = response.data.docs;
      for (let i = 0; i < response_result.length; i++) {

        if (book.title.toLowerCase() == response_result[i].title.toLowerCase() && 
        response_result[i].author_name &&
        x == 0 )
        { 
          x = 1;
          console.log(response_result[i]);
          covers.push(
            response_result[i].cover_edition_key
              ? response_result[i].cover_edition_key
              : null,
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  covers = covers.filter((cover) => cover != null);
  console.log(covers);
  return covers;
}

let query = null;

app.get("/", async (req, res) => {
  let covers = [];
  const result = query
    ? await db.query(
        "select * from reviews where title like '%' || $1 || '%' or author like '%' || $1 || '%'",
        [query],
      )
    : await db.query("select * from reviews");
  const data = result.rows;
  //console.log(data);
  covers = await getCovers(data);
  res.render("index.ejs", {
    books: data,
    covers: covers,
  });
});

app.post("/search", async (req, res) => {
  query = req.body.query;
  res.redirect("/");
});

app.post("/home", (req, res) => {
  query = null;
  res.redirect("/");
});

app.post("/sort", async (req, res) => {
  let covers = [];
  let result = [];
  let type = req.body.sort;
  if (type == "Recency") {
    result = await db.query("select * from reviews order by date_time DESC");
  } else if (type == "Author") {
    result = await db.query("select * from reviews order by author ASC");
  } else {
    result = await db.query("select * from reviews order by title ASC");
  }
  const data = result.rows;
  covers = await getCovers(data);
  res.render("index.ejs", {
    books: data,
    covers: covers,
    sort: type,
  });
});

app.get("/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await db.query("select * from reviews where id = $1", [id]);
  const data = result.rows[0];
 // console.log(data);
  res.render("edit.ejs", {
    book: data,
  });
});

app.post("/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const rating = parseInt(req.body.rating);
  const review = req.body.review;
  await db.query("update reviews set review = $1, rating = $2 where id = $3", [
    review,
    rating,
    id,
  ]);
  res.redirect("/");
});

app.post("/delete/:id", async(req,res) => {
  const id = parseInt(req.params.id);
  await db.query("delete from reviews where id = $1",[id]);
  res.redirect("/");
})

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
