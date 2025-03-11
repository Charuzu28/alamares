const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//home IP
//o8V3JsROqvy8Gil5
//DWCL
//uTAlCpvxZWvGXoEt
  //connect
  // mongoose.connect('mongodb+srv://07212533:o8V3JsROqvy8Gil5@cluster0.2w7ko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  mongoose.connect('mongodb+srv://charls:uTAlCpvxZWvGXoEt@cluster0.uflwr.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(()=>{
    console.log('Connected to database!')
  }).catch(()=>{
    console.log("Error connecting to Database")
  })

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
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save();
    res.status(201).json({
      message: "Post added successfully",
    });
  });

app.get("/api/posts",(req, res, next) => {
    Post.find()
        .then(documents => {
          res.status(200).json({
            message: 'Post successfully fetched',
            posts: documents
          });
        });
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id }).then(result => {
      console.log(result);
      console.log(req.param.id);
      res.status(200).json({message: "Post Deleted"});
    })
})

module.exports = app;