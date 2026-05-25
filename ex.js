import express from "express";
import  bodyParser from "body-parser";
import pg from "pg";
const port = 5000;
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "BookNotes",
    password : "1234",
    port : 5432
});

db.connect();

app.get("/", async(req,res) => {
    const result = await db.query("select * from reviews where id = 1");
    const data = result.rows[0];
    res.render("edit.ejs",{
        book : data,
    });
});

app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`);
});