const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require("path");
const postRoutes = require('./routes/posts'); 
const  userRoutes = require("./routes/user");  

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


app.get("/", (req, res) => {
  res.send("This is the homepage");
});


app.use("/api/posts", postRoutes); 
app.use("/api/user", userRoutes);  


module.exports = app;
