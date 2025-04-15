const express = require("express");  
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");  // Capitalize model by convention
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {  
  bcrypt.hash(req.body.password, 10)  
    .then(hash => {  
      const newUser = new User({  // Create instance properly
        email: req.body.email,  
        password: hash  
      });

      return newUser.save(); // ✅ Fix here
    })
    .then(result => {  
      res.status(201).json({  
        message: "User Created",  
        result: result  
      });  
    })
    .catch(err => {  
      console.error("Signup error:", err);  // Helpful log
      res.status(500).json({  
        error: err  
      });  
    });  
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "Auth failed" });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({ message: "Auth failed" });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id }, // ✅ FIXED here
        "A_very_long_string_for_our_secret",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(401).json({ message: "Invalid authentication credentials!" });
    });
});

    

module.exports = router;
