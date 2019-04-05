const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const User = require('./server/models/User');
const indexRouter = require('./server/routes/index');
// const activationRouter = require('./routes/activation');
// const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
var session = require('express-session');
var bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
app.use(express.static('public'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


function hasNumber(myString) {
    return /\d/.test(myString);
}
function hasLetter(myString){
    return /[a-z]/i.test(str);
}
function hasSymbol(myString) {
    let arr = ["_"];
    return (new RegExp(arr.join("|"))).test(myString);
}
function hasCases(myString){
    return (/[a-z]/.test(myString))&&(/[A-Z]/.test(myString));
}

mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: false});
let transporter = nodemailer.createTransport({
    service:
        'Gmail',
    host: 'smtp.gmail.com',
    port: 465, // SMTP
    // secureConnection: true,
    auth: {
        user: 'bloggy233@gmail.com',
        pass: 'ilovebloggy233'
    }
});


app.get('/', function (req, res) {
    res.sendFile(path.join('/home/ubuntu/home/CTF2/public/index.html'));

});

app.get('/test', function (req, res) {
    res.redirect('/success.html');
});

// @route   POST api/posts/login
// @desc    Login User / Returning JWT Token
// @access  Public
app.post("/login", (req, res) => {

    // check password
    const email = req.body.email;
    const password = req.body.psw;

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
                };
                res.redirect('/success.html');

            } else {
                res.redirect('/fail.html');
                // errors.password = "Password incorrect";
                // return res.status(400).json(errors);
            }
        });
    });
});

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
app.post("/register", (req, res) => {
    console.log(req.body);
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            var pw1 = req.body.psw;
            var pw2 = req.body.psw_;
            if(pw1 !== pw2 || !checkpassword(pw1)){
                res.redirect("/fail.html");
            }
            else{
                // create User object
                const newUser = new User({
                    email: req.body.email,
                    password: req.body.psw

                });

                // encrypt
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.redirect("/success.html");
                                // res.json(user);
                            })
                            .catch(err => console.log(err));
                    });
                });
            }

        }
    });
});

app.post("/send", (req, res) => {
    email = req.body.email;
    console.log(email);
    let mailOptions = {
        from: '"CTF2" <bloggy233@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        html: "http://52.53.197.21/reset.html" // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log("www");
        console.log("Message sent: %s", info.messageId);
        res.redirect('/send.html');


    });
});

//reset
app.post("/reset", (req, res) => {
    email = req.body.email;
    oldpsw = req.body.oldpsw;
    newpsw = req.body.psw;
    newpsw2 = req.body.psw_;

    if(newpsw !== newpsw2 || oldpsw == newpsw || newpsw.length< 8){
        res.redirect("/fail.html");
    }
    if(!checkpassword(newpsw))
        res.redirect("/fail.html");

    User.findOne({ email }).then(user => {
        // check for user
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }

        // Check Password
        bcrypt.compare(oldpsw, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.id,
                };
                //reset password
                // encrypt
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newpsw, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user
                            .save()
                            .then(user => {
                                res.redirect("/success.html");
                                // res.json(user);
                            })
                            .catch(err => console.log(err));
                    });
                });

            } else {
                res.redirect('/fail.html');
                // errors.password = "Password incorrect";
                // return res.status(400).json(errors);
            }
        });
    });

    console.log(email);
});

function checkpassword(password){
    if(password.length < 8)
        return false;
    else if(!hasNumber(password)){
        return false;
    }
    else if(!hasCases(password))
        return false;
    else if(!hasSymbol(password))
        return false;
    else
        return true;

}
function testInput(name, password, password_){
    var output = document.getElementById("ph");
    if(name.length==0){
        output.innerHTML = "email can't be blank";
        return false;
    }
    else if(password!=password_){
        output.innerHTML = "you must enter the same password";
        return false;
    }
    else if(password.length <8){
        output.innerHTML = "password must have at least 8 characters";
        return false;
    }
    else if(!hasNumber(password)){
        output.innerHTML = "password must have at least least 1 number";
        return false;
    }
    else if(!hasNumber(password)){
        output.innerHTML = "password must have at least least 1 upper case and 1 lower case";
        return false;
    }
    else if(!hasCases(password)){
        output.innerHTML = "password must have at least least 1 upper case and 1 lower case";
        return false;
    }
    else if(!hasSymbol(password)){
        output.innerHTML = "password must have at least least 1 symbol (_)";
        return false;
    }
    else{
        output.innerHTML = "";
        return false;
    }
    return true;
}
const port = process.env.PORT || 80;

app.listen(80, '172.31.5.224', () => console.log(`Server running on port ${port}`));


module.exports = app;
