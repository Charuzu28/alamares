const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.send("This is the homepage");
  });
  
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"),
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
  
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
  
    next();
  });
  
  app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
  
    res.status(201).json({
      message: "Post added successfully",
    });
  });

app.use("/api/posts",(req, res, next) => {
    const posts = 
        [
            {
         id: "eoiyaruia",
         title: "first title from server-side",
         content: "first content from server-side" },
         {
            id: "ehsdaskda",
            title: "second title from server-side",
            content: "second content from server-side" }
        ];

    res.status(200).json({
        message: 'Post successfully!',
        posts: posts
    });
});

module.exports = app;