const express = require("express");
const cors = require("cors");

const app = express();
const bookRouter = require("./app/routes/book.route");

app.use(cors());
app.use(express.json());
app.use("/api/book", bookRouter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the book borrowing application."})
});

module.exports = app