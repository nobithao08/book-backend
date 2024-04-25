const express = require("express");
const cors = require("cors");

const booksRouter = require("./app/routes/book.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
   res.json({ message: "Welcome to Book store!" }); 
});
app.use("/api/books/", booksRouter);
app.use((err, req, res, next) => {
   return res.status(err.statusCode || 500).json({
       message: err.message || "Internal Server Error",
   });
});

module.exports = app;