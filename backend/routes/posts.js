const express = require("express");
const Post = require('../models/post');
const multer = require("multer");
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// ✅ Fix storage config (no duplicate cb call)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error("Invalid Mime Type");
    cb(error, "backend/images"); // ✅ one call to cb
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });

    post.save()
      .then((result) => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            id: result._id,
            title: result.title,
            content: result.content,
            imagePath: result.imagePath,
          },
        });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Failed to save post", error });
      });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const post = {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    };

    Post.updateOne({ _id: req.params.id }, post)
      .then(result => {
        res.status(200).json({ message: "Update Successful!", imagePath });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Update failed", error });
      });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  }).catch(err => {
    console.error(err);
    res.status(500).json({ message: "Fetching post failed!" });
  });
});


router.get("/", (req, res) => {
  let documents;
  const PageSize = +req.query.pagesize;
  const CurrentPage = +req.query.currentpage;
  const postquery = Post.find();

  if (PageSize && CurrentPage) {
    postquery.skip(PageSize * (CurrentPage - 1)).limit(PageSize);
  }

  postquery
    .then((docs) => {
      documents = docs;
      return Post.countDocuments(); // ✅ FIXED HERE
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents,
        maxPosts: count // ✅ Used by pagination
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Fetching posts failed" });
    });
});

router.delete("/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log("Deleted:", result);
    res.status(200).json({ message: "Post deleted" });
  });
});

module.exports = router;