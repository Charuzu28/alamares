const express = require('express');

const app = express();

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