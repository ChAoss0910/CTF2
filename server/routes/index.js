
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// const fs = require("fs");
const mongoose = require("mongoose");


// Load User Model
const User = require("../models/User");


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
    res.json({
        msg: "User Works"
    })
);


// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
    // check validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {

            // create User object
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                avatar
            });

            // encrypt
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route   POST api/posts/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
    // check validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check password
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        // check for user
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                };
                // Sign Token
                jwt.sign(
                    payload,
                    process.env.SECRET_OR_KEY,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                errors.password = "Password incorrect";
                return res.status(400).json(errors);
            }
        });
    });
});

module.exports = router;
