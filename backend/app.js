const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require("path");
const postRoutes = require('./routes/posts'); 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); 
app.use("/images", express.static(path.join(__dirname, "images")));

mongoose.connect('mongodb+srv://charls:uTAlCpvxZWvGXoEt@cluster0.uflwr.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to database!');
  }).catch(() => {
    console.log("Error connecting to Database");
  });

app.use("/api/posts", postRoutes); 


app.get("/", (req, res) => {
  res.send("This is the homepage");
});

// app.post("/api/posts", (req, res, next) => {
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content
//   });
//   post.save().then(result => {
//     res.status(201).json({
//       message: "Post added successfully",
//       postId: result._id
//     });
//   });
// });

// app.get("/api/posts", (req, res, next) => {
//   Post.find()
//     .then(documents => {
//       res.status(200).json({
//         message: 'Posts successfully fetched',
//         posts: documents
//       });
//     });
// });

// app.get("/api/posts/:id", (req, res, next) => {
//   Post.findById(req.params.id).then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({ message: "Post not found!" });
//     }
//   });
// }); 


// app.put("/api/posts/:id", (req, res, next) => {
//   const post = new Post({
//     _id: req.body.id,
//     title: req.body.title,
//     content: req.body.content
//   });
//   Post.updateOne({ _id: req.params.id }, post).then(result => {
//     console.log(result);
//     res.status(200).json({ message: "Update Successful!" });
//   });
// });


// app.delete("/api/posts/:id", (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id }).then(result => {
//     console.log(result);
//     res.status(200).json({ message: "Post Deleted" });
//   });
// });



module.exports = app;
